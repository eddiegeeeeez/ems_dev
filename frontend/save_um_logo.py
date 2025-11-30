#!/usr/bin/env python3
"""
Script to download and save the UM logo
Run this from the frontend directory: python save_um_logo.py
"""
import os
import sys

# The correct way to handle this is to use PIL if available
# Or copy the file from source
try:
    from PIL import Image
    import requests
    
    # If you have the image locally, just copy it
    source = r"C:\path\to\your\um-logo.jpg"  # Update this path
    dest = os.path.join(os.path.dirname(__file__), "public", "um-logo.png")
    
    if os.path.exists(source):
        img = Image.open(source)
        img.save(dest, "PNG")
        print(f"✓ Logo saved to {dest}")
    else:
        print(f"✗ Source image not found at {source}")
        
except ImportError:
    print("PIL not installed. Using file copy method instead...")
    import shutil
    try:
        source = r"C:\Users\z87kc4ivan\Downloads\logo.png"
        dest = r"C:\Users\z87kc4ivan\Downloads\it9\ems_dev\frontend\public\um-logo.png"
        shutil.copy(source, dest)
        print(f"✓ Logo copied to {dest}")
    except Exception as e:
        print(f"✗ Error: {e}")
