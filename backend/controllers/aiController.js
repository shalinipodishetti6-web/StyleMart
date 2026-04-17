import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import util from 'util';

const execFileAsync = util.promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: save remote image to uploads folder
async function downloadImage(url, destPath) {
  const res = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFileSync(destPath, res.data);
}

// Helper: convert file to Blob for Gradio
function fileToBlob(filePath, mimeType = 'image/jpeg') {
  const buffer = fs.readFileSync(filePath);
  return new Blob([buffer], { type: mimeType });
}

// Helper: fetch URL to Blob for Gradio
async function urlToBlob(url) {
  const res = await axios.get(url, { responseType: 'arraybuffer' });
  const mimeType = res.headers['content-type'] || 'image/jpeg';
  return new Blob([res.data], { type: mimeType });
}

export const processVirtualTryOn = async (req, res) => {
  let userImagePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded. Please upload a photo of yourself.' });
    }

    userImagePath = req.file.path;

    const { garmentImageUrl, garmentDescription } = req.body;

    if (!garmentImageUrl) {
      return res.status(400).json({ success: false, message: 'No garment selected. Please select a clothing item.' });
    }

    const hfToken = process.env.HUGGINGFACE_API_TOKEN;
    if (!hfToken) {
      return res.status(500).json({ success: false, message: 'Server configuration error: Hugging Face API token not set.' });
    }

    // Prepare uploads dir for results
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const resultFileName = `tryon-result-${Date.now()}.jpg`;
    const resultPath = path.join(uploadsDir, resultFileName);

    // Prepare garment image path
    let finalGarmentPath;
    let createdGarmentTemp = false;

    if (garmentImageUrl.startsWith('data:')) {
      const parts = garmentImageUrl.split(',');
      const buffer = Buffer.from(parts[1], 'base64');
      finalGarmentPath = path.join(uploadsDir, `temp-garment-${Date.now()}.png`);
      fs.writeFileSync(finalGarmentPath, buffer);
      createdGarmentTemp = true;
    } else if (garmentImageUrl.startsWith('http')) {
      finalGarmentPath = path.join(uploadsDir, `temp-garment-${Date.now()}.png`);
      await downloadImage(garmentImageUrl, finalGarmentPath);
      createdGarmentTemp = true;
    } else {
      // Local relative path like /uploads/image.jpg — resolve from project root
      const localPath = garmentImageUrl.startsWith('/')
        ? path.join(process.cwd(), garmentImageUrl)
        : path.join(__dirname, '..', garmentImageUrl);
      finalGarmentPath = localPath;
    }

    console.log('Sending try-on request to IDM-VTON using Python worker...');
    
    // Execute python worker script
    const pyScript = path.join(__dirname, '..', 'ai_tryon.py');
    let stdout, stderr;
    try {
      const result = await execFileAsync('python', [
        pyScript,
        hfToken,
        userImagePath,
        finalGarmentPath,
        garmentDescription || 'clothing item',
        resultPath
      ]);
      stdout = result.stdout;
      stderr = result.stderr;
    } catch (cmdErr) {
      stdout = cmdErr.stdout;
      stderr = cmdErr.stderr;
      if (!stdout) throw cmdErr; // if completely failed to spawn
    }
    
    let pyResult;
    try {
      pyResult = JSON.parse(stdout);
    } catch (err) {
      console.error('Failed to parse python output:', stdout);
      throw new Error('Internal worker failed to return structured data');
    }

    if (!pyResult.success) {
      throw new Error(pyResult.error || 'Python worker reported an unknown error');
    }

    // Clean up temporary files
    if (userImagePath && fs.existsSync(userImagePath)) {
      fs.unlinkSync(userImagePath);
    }
    if (createdGarmentTemp && fs.existsSync(finalGarmentPath)) {
      fs.unlinkSync(finalGarmentPath);
    }

    res.json({
      success: true,
      message: 'Virtual try-on generated successfully!',
      imageUrl: `/uploads/${resultFileName}`,
      garmentDescription: garmentDescription || 'selected item',
    });

  } catch (error) {
    if (userImagePath && fs.existsSync(userImagePath)) {
      try { fs.unlinkSync(userImagePath); } catch (_) {}
    }

    console.error('Try-on error:', error.message);

    let userMessage = 'Try-on failed. Please try again.';
    if (error.message?.includes('warming up') || error.message?.includes('wake')) {
      userMessage = error.message;
    } else if (error.message?.includes('ZeroGPU')) {
      userMessage = 'You have reached the daily limit for free AI try-ons. Please try again later!';
    } else if (error.message?.includes('token') || error.status === 401) {
      userMessage = 'API token error. Please check your HUGGINGFACE_API_TOKEN in .env';
    } else if (error.message?.includes('timed out') || error.code === 'ECONNABORTED') {
      userMessage = 'Try-on timed out. The AI model is busy — please try again in a minute.';
    } else if (error.message?.includes('No output')) {
      userMessage = 'The AI model failed to produce a valid image. Please try another photo.';
    }

    res.status(500).json({ success: false, message: userMessage, error: error.message });
  }
};

export const generateCustomDesign = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Design description is required' });
    }

    const hfToken = process.env.HUGGINGFACE_API_TOKEN;
    if (!hfToken) {
      return res.status(500).json({ success: false, message: 'Server configuration error: Hugging Face API token not set.' });
    }

    const enhancedPrompt = `fashion clothing design, ${prompt}, white background, professional product photo, high quality`;

    // Try multiple models/endpoints to reduce "model not available" failures (410 Gone).
    const modelIds = [
      'stabilityai/stable-diffusion-xl-base-1.0',
      'stabilityai/stable-diffusion-2-1-base',
      'runwayml/stable-diffusion-v1-5',
    ];

    let lastErr = null;
    let inferRes = null;

    for (const MODEL_ID of modelIds) {
      const apiUrl = `https://api-inference.huggingface.co/models/${MODEL_ID}`;
      try {
        const response = await axios.post(
          apiUrl,
          { inputs: enhancedPrompt, parameters: { guidance_scale: 7.5, num_inference_steps: 30 } },
          {
            headers: {
              Authorization: `Bearer ${hfToken}`,
              'Content-Type': 'application/json',
              // Helps ensure we get image bytes back.
              Accept: 'image/png',
              'X-Wait-For-Model': 'true',
            },
            timeout: 120000,
            responseType: 'arraybuffer',
            // Prevent Axios from attempting to JSON-parse non-JSON error bodies (e.g. HTML),
            // and don't throw on non-2xx so we can check `response.status` ourselves.
            transformResponse: [(data) => data],
            validateStatus: () => true,
          }
        );
        if (response.status >= 200 && response.status < 300) {
          inferRes = response;
          break;
        }

        lastErr = new Error(`Model request failed: status ${response.status}`);
        lastErr.status = response.status;
      } catch (e) {
        // Network/transport errors: keep trying next model.
        lastErr = e;
      }
    }

    if (!inferRes) {
      // Fallback: create an SVG "image" containing the prompt text.
      // This keeps the Customize page functional even when the external model is unavailable.
      const uploadsDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const safePrompt = String(prompt)
        .slice(0, 220)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

      const fileName = `custom-design-fallback-${Date.now()}.svg`;
      const imagePath = path.join(uploadsDir, fileName);

      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a4a94" stop-opacity="1"/>
      <stop offset="100%" stop-color="#ff8c00" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="#f5f5f5"/>
  <rect x="80" y="80" width="1040" height="640" rx="24" fill="url(#g)" opacity="0.15"/>
  <rect x="120" y="120" width="960" height="560" rx="20" fill="#ffffff" stroke="#e5e5e5"/>
  <text x="600" y="330" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="38" fill="#0a4a94" font-weight="700">
    Custom Design Preview
  </text>
  <text x="600" y="400" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#333">
    ${safePrompt}
  </text>
  <text x="600" y="470" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#666">
    AI model unavailable; using fallback preview
  </text>
</svg>`;

      fs.writeFileSync(imagePath, svg, 'utf8');

      return res.json({
        success: true,
        message: 'Design preview generated (AI model unavailable)',
        imageUrl: `/uploads/${fileName}`,
        prompt,
        usedFallback: true,
        lastError: lastErr?.message || null,
      });
    }

    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const promptHash = Buffer.from(prompt).toString('base64').substring(0, 10);
    const fileName = `custom-design-${promptHash}-${Date.now()}.png`;
    const imagePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(imagePath, Buffer.from(inferRes.data));

    res.json({
      success: true,
      message: `Design generated for: "${prompt}"`,
      imageUrl: `/uploads/${fileName}`,
      prompt,
    });

  } catch (error) {
    console.error('Design generation error:', error.message);
    const status = error.response?.status;
    let userMessage = 'Failed to generate design. Please try again.';

    if (status === 503) {
      userMessage = 'AI model is warming up. Please wait 30 seconds and try again.';
    } else if (status === 410) {
      userMessage = 'AI model is not available (410 Gone). Please try again later or update your Hugging Face token/model access.';
    } else if (status === 404) {
      userMessage = 'AI model not found (404). Please try again with a different prompt.';
    }

    // Provide extra (non-secret) debugging details for the frontend/devtools.
    let details = undefined;
    try {
      const data = error.response?.data;
      if (typeof data === 'string') details = data.slice(0, 2000);
      else if (data) details = JSON.stringify(data).slice(0, 2000);
    } catch (_) {}

    res.status(500).json({ success: false, message: userMessage, error: error.message, status, details });
  }
};
