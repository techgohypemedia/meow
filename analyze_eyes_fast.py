import os
from PIL import Image

def analyze_frames(dir_path):
    frames = []
    
    for i in range(1, 193):
        filename = f"frame_{i:04d}.png"
        filepath = os.path.join(dir_path, filename)
        
        if not os.path.exists(filepath):
            continue
            
        img = Image.open(filepath).convert('RGB')
        # Resize to 32x32 for ultra-fast processing
        img = img.resize((32, 32))
        width, height = img.size
        pixels = img.load()
        
        blue_x = []
        blue_y = []
        
        for y in range(height):
            for x in range(width):
                r, g, b = pixels[x, y]
                # Look for the blue eyes (b is dominant)
                if b > r + 30 and b > 50:
                    blue_x.append(x)
                    blue_y.append(y)
                    
        if blue_x and blue_y:
            avg_x = sum(blue_x) / len(blue_x)
            avg_y = sum(blue_y) / len(blue_y)
            frames.append((i, avg_x, avg_y))
        else:
            frames.append((i, 0, 0))
            
    print("Frames 1-24:")
    for i in range(24):
        print(f"{frames[i][0]}: x={frames[i][1]:.1f}, y={frames[i][2]:.1f}")

    print("\nFrames 25-48:")
    for i in range(24, 48):
        print(f"{frames[i][0]}: x={frames[i][1]:.1f}, y={frames[i][2]:.1f}")
        
    print("\nFrames 80-100:")
    for i in range(80, 100):
        print(f"{frames[i][0]}: x={frames[i][1]:.1f}, y={frames[i][2]:.1f}")
        
analyze_frames('d:/Meow/meow-ganics/public/cat_eye_video_frames_transparent')
