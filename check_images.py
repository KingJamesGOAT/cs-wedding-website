
import os
from PIL import Image

assets_dir = r"c:\Users\sbste\OneDrive\Desktop\CS Wedding Website\src\assets"
files = [
    "hero-image-v3.jpg",
    "hero-image-v4.jpg",
    "hero-image-mobile-v2.jpg",
    "0d1cd457186d307d42955abe79608185de75d7aa.png",
    "2c1a399487b0eaf24b4eb22a66fb37e1c381bf12.png",
    "cbe880ec8c3cdfbbf3a2b6dbf42c2851ff18806c.png"
]

for f in files:
    path = os.path.join(assets_dir, f)
    try:
        with Image.open(path) as img:
            print(f"{f}: {img.width}x{img.height}")
    except Exception as e:
        print(f"{f}: Error {e}")
