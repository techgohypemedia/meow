import os
import math
from PIL import Image

def analyze_frames(dir_path):
    frames = []
    
    # We will analyze frames 1 to 192
    for i in range(1, 193):
        filename = f"frame_{i:04d}.png"
        filepath = os.path.join(dir_path, filename)
        
        if not os.path.exists(filepath):
            print(f"Missing {filename}")
            continue
            
        img = Image.open(filepath).convert('RGB')
        width, height = img.size
        pixels = img.load()
        
        # We want to find the blue eye area and the black pupils.
        # But maybe we can just find the bounding box of blue pixels!
        # Because the pupils are inside the blue.
        # Or even simpler, the eye is blue, let's just find the center of the blue pixels.
        
        blue_x = []
        blue_y = []
        
        for y in range(height):
            for x in range(width):
                r, g, b = pixels[x, y]
                # Light blue eyes: R~150, G~200, B~240 
                # Just checking if b > r + 50 and b > g
                if b > r + 30 and b > 100:
                    blue_x.append(x)
                    blue_y.append(y)
                    
        if blue_x and blue_y:
            avg_x = sum(blue_x) / len(blue_x)
            avg_y = sum(blue_y) / len(blue_y)
            frames.append((i, avg_x, avg_y))
        else:
            frames.append((i, 0, 0))
            
    # Print out frames at key intervals to understand the structure
    # For example, let's print the first 24 frames
    print("First 24 frames:")
    for i in range(24):
        print(f"Frame {frames[i][0]}: x={frames[i][1]:.1f}, y={frames[i][2]:.1f}")
        
    print("\nFrames 80-100:")
    for i in range(80, 100):
        print(f"Frame {frames[i][0]}: x={frames[i][1]:.1f}, y={frames[i][2]:.1f}")
        
    # Let's find min and max x/y to understand the grid bounds
    xs = [f[1] for f in frames if f[1] > 0]
    ys = [f[2] for f in frames if f[2] > 0]
    if xs and ys:
        print(f"\nBounds: X({min(xs):.1f} - {max(xs):.1f}), Y({min(ys):.1f} - {max(ys):.1f})")

analyze_frames('d:/Meow/meow-ganics/public/cat_eye_video_frames_transparent')
