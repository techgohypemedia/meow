import sys, os, re
import numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
sys.path.insert(0, os.path.abspath('.'))
from vectorize import extract_loops, rdp_closed, loops_to_svg_path

img_p = r'C:\Users\anike\.gemini\antigravity-ide\brain\b71d0ba0-443f-4ab1-8e44-6c3f0862be17\.user_uploaded\media_1791957144654.png'
im = Image.open(img_p)
arr = np.array(im)
visible_black = (arr[:,:,3] > 128) & (arr[:,:,0] < 50)
temp_p = 'd:/Meow/meow-ganics/public/temp_user_profile.png'
Image.fromarray((~visible_black * 255).astype(np.uint8)).save(temp_p)

loops = extract_loops(temp_p, sigma=0.8)
simp_loops = [rdp_closed(l, 0.5) for l in loops]
svg_d = loops_to_svg_path(simp_loops, viewBox_size=24, padding_x=1.2, padding_y=1.2)

nums = [float(x) for x in re.findall(r'[-+]?\d*\.\d+|\d+', svg_d)]
xs = nums[0::2]
ys = nums[1::2]
print(f'Simplified counts: {[len(l) for l in simp_loops]}')
print(f'Bounds: x in [{min(xs):.2f}, {max(xs):.2f}], y in [{min(ys):.2f}, {max(ys):.2f}]')

# Verify IoU against uploaded image
w, h = im.size
canvas = np.zeros((h, w), dtype=int)
for loop in simp_loops:
    mask = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(mask)
    pts = [(p[0]-4, p[1]-4) for p in loop]
    d.polygon(pts, fill=1)
    canvas += np.array(mask)

evenodd = ((canvas % 2) != 0)
iou = np.logical_and(evenodd, visible_black).sum() / np.logical_or(evenodd, visible_black).sum()
print(f'IoU with uploaded image: {iou*100:.2f}%')

# Save SVG asset
with open('d:/Meow/meow-ganics/public/profile_icon.svg', 'w') as f:
    f.write(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd">
  <path d="{svg_d}" />
</svg>''')

# Write to ProfileIcon.tsx
tsx_content = f'''import React from "react";

interface ProfileIconProps extends React.SVGProps<SVGSVGElement> {{
  className?: string;
}}

export default function ProfileIcon({{
  className = "w-6 h-6",
  ...props
}}: ProfileIconProps) {{
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      className={{className}}
      {{...props}}
    >
      <path d="{svg_d}" />
    </svg>
  );
}}
'''

with open('d:/Meow/meow-ganics/src/components/ProfileIcon.tsx', 'w', encoding='utf-8') as f:
    f.write(tsx_content)

if os.path.exists(temp_p):
    os.remove(temp_p)

print("Saved ProfileIcon.tsx and profile_icon.svg successfully!")
