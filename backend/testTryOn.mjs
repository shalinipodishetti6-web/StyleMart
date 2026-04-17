import { Client } from '@gradio/client';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import util from 'util';

const execFileAsync = util.promisify(execFile);
const HF_TOKEN = process.env.HF_TOKEN;
const TEST_PERSON = './uploads/test-person.jpg';
const TEST_GARMENT_URL = 'https://placehold.co/300x400/png?text=Blue+Jeans';

async function main() {
  if (!HF_TOKEN) {
    console.error('Missing HF_TOKEN env var. Set HF_TOKEN before running this script.');
    process.exit(1);
  }

  // Download person image if not present
  if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');
  if (!fs.existsSync(TEST_PERSON)) {
    console.log('Downloading test person image...');
    const res = await axios.get('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', { responseType: 'arraybuffer' });
    fs.writeFileSync(TEST_PERSON, res.data);
    console.log('Downloaded test person image.');
  }

  // Download garment image
  const garmentPath = './uploads/test-garment.jpg';
  if (!fs.existsSync(garmentPath)) {
    console.log('Downloading garment image...');
    const res = await axios.get(TEST_GARMENT_URL, { responseType: 'arraybuffer' });
    fs.writeFileSync(garmentPath, res.data);
    console.log('Downloaded garment image.');
  }

  console.log('\n--- Calling Python Worker ---');
  
  try {
    const { stdout, stderr } = await execFileAsync('python', [
      'ai_tryon.py',
      HF_TOKEN,
      TEST_PERSON,
      garmentPath,
      'blue denim jeans',
      './uploads/test-result.jpg'
    ]);
    console.log('Python Worker stdout:', stdout);
    if(stderr) console.error('Python Worker stderr:', stderr);
    
    const pyResult = JSON.parse(stdout);
    if(pyResult.success){
        console.log('✅ Result saved to ./uploads/test-result.jpg');
    } else {
        console.error('Python worker returned error:', pyResult.error);
    }
  } catch(e) {
    console.error('Python execution failed:', e);
  }
}

main();
