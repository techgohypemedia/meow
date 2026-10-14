import sys, os, re
import numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
sys.path.insert(0, os.path.abspath('.'))
from vectorize import extract_loops, rdp_closed, loops_to_svg_path

# Profile (from the user's latest uploaded image)
img_p = r'C:\Users\anike\.gemini\antigravity-ide\brain\b71d0ba0-443f-4ab1-8e44-6c3f0862be17\.user_uploaded\media_1791957144654.png'
im_p = Image.open(img_p)
vis_p = (np.array(im_p)[:,:,3] > 128) & (np.array(im_p)[:,:,0] < 50)
temp_p = 'd:/Meow/meow-ganics/public/temp_p.png'
Image.fromarray((~vis_p * 255).astype(np.uint8)).save(temp_p)
loops_p = extract_loops(temp_p, sigma=0.8)
simp_p = [rdp_closed(l, 0.5) for l in loops_p]

# Cart
img_c = 'd:/Meow/meow-ganics/public/cart_icon_raw.png'
loops_c = extract_loops(img_c, sigma=1.0)
simp_c = [rdp_closed(l, 0.8) for l in loops_c]

# Let's inspect cart path with padding 0.6
path_c = loops_to_svg_path(simp_c, viewBox_size=24, padding_x=0.6, padding_y=0.6)
nums_c = [float(x) for x in re.findall(r'[-+]?\d*\.\d+|\d+', path_c)]
xs_c = nums_c[0::2]
ys_c = nums_c[1::2]
cart_w = max(xs_c) - min(xs_c)
cart_h = max(ys_c) - min(ys_c)
print(f'Cart bounds: w={cart_w:.2f}, h={cart_h:.2f}')

# Now for Profile: We want its visual height and presence to match Cart
# If Cart has height ~16.0, Profile with pad 3.8 has width and height: 24 - 2 * 3.8 = 16.4
# Let's check pad=3.8
path_p = loops_to_svg_path(simp_p, viewBox_size=24, padding_x=3.8, padding_y=3.8)
nums_p = [float(x) for x in re.findall(r'[-+]?\d*\.\d+|\d+', path_p)]
xs_p = nums_p[0::2]
ys_p = nums_p[1::2]
prof_w = max(xs_p) - min(xs_p)
prof_h = max(ys_p) - min(ys_p)
print(f'Profile bounds: w={prof_w:.2f}, h={prof_h:.2f}')

# Write both components
with open('d:/Meow/meow-ganics/src/components/CartIcon.tsx', 'w', encoding='utf-8') as f:
    f.write(f'''import React from "react";

interface CartIconProps extends React.SVGProps<SVGSVGElement> {{
  className?: string;
}}

export default function CartIcon({{ className = "w-6 h-6", ...props }}: CartIconProps) {{
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      className={{className}}
      {{...props}}
    >
      <path d="{path_c}" />
    </svg>
  );
}}
''')

with open('d:/Meow/meow-ganics/src/components/ProfileIcon.tsx', 'w', encoding='utf-8') as f:
    f.write(f'''import React from "react";

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
      <path d="{path_p}" />
    </svg>
  );
}}
''')

# Also sync public SVGs
with open('d:/Meow/meow-ganics/public/cart_icon.svg', 'w') as f:
    f.write(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd">
  <path d="{path_c}" />
</svg>''')

with open('d:/Meow/meow-ganics/public/profile_icon.svg', 'w') as f:
    f.write(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd">
  <path d="{path_p}" />
</svg>''')

# Clean up
if os.path.exists(temp_p): os.remove(temp_p)
if os.path.exists('d:/Meow/meow-ganics/public/cart_icon_raw.png'): os.remove('d:/Meow/meow-ganics/public/cart_icon_raw.png')

print("Both icons re-sized and updated successfully!")
