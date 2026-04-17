import sys
import os
import json
from gradio_client import Client, file

def tryon(hf_token, user_image_path, garment_image_path, garment_description, result_path):
    import sys
    import os
    
    # Suppress all stdout from gradio client (redirect to devnull)
    old_stdout = sys.stdout
    devnull = open(os.devnull, 'w')
    sys.stdout = devnull
    
    try:
        # Create client
        client = Client("yisol/IDM-VTON", token=hf_token, verbose=False)
        
        # Call prediction
        result = client.predict(
            dict={"background": file(user_image_path), "layers": [], "composite": None},
            garm_img=file(garment_image_path),
            garment_des=garment_description,
            is_checked=True,
            is_checked_crop=False,
            denoise_steps=30,
            seed=42,
            api_name="/tryon"
        )
        
        # Result is a tuple with paths. e.g. (image_path1, image_path2)
        # result[0] is the primary output image
        output_img = result[0] if isinstance(result, tuple) else result
        
        # Move image to final destination
        import shutil
        shutil.copyfile(output_img, result_path)
        
        sys.stdout = old_stdout
        devnull.close()
        old_stdout.write(json.dumps({"success": True}) + "\n")
        old_stdout.flush()
        
    except Exception as e:
        sys.stdout = old_stdout
        try:
            devnull.close()
        except Exception:
            pass
        old_stdout.write(json.dumps({"success": False, "error": str(e)}) + "\n")
        old_stdout.flush()
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) < 6:
        print(json.dumps({"success": False, "error": "Missing arguments"}))
        sys.exit(1)
        
    tryon(
        hf_token=sys.argv[1],
        user_image_path=sys.argv[2],
        garment_image_path=sys.argv[3],
        garment_description=sys.argv[4],
        result_path=sys.argv[5]
    )
