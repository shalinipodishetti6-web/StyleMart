import os
import sys
from gradio_client import Client, file

def test():
    hf_token = os.environ.get("HF_TOKEN")
    if not hf_token:
        raise SystemExit("Missing HF_TOKEN env var. Set HF_TOKEN before running this script.")
    
    person_img = './uploads/test-person.jpg'
    garment_img = './uploads/test-garment.jpg'
    
    print("Connecting to IDM-VTON...")
    client = Client("yisol/IDM-VTON", token=hf_token)
    
    print("Calling API...")
    try:
        result = client.predict(
            dict={"background": file(person_img), "layers": [], "composite": None},
            garm_img=file(garment_img),
            garment_des="blue denim jeans",
            is_checked=True,
            is_checked_crop=False,
            denoise_steps=30,
            seed=42,
            api_name="/tryon"
        )
        print("Success:", result)
    except Exception as e:
        print("Error:", str(e))

if __name__ == '__main__':
    test()
