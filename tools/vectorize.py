import numpy as np
import re
from PIL import Image
from scipy.ndimage import gaussian_filter

def interp(p1, p2, v1, v2, level=0.5):
    if abs(v2 - v1) < 1e-6:
        t = 0.5
    else:
        t = (level - v1) / (v2 - v1)
    t = max(0.0, min(1.0, t))
    return (round(p1[0] + t * (p2[0] - p1[0]), 3), round(p1[1] + t * (p2[1] - p1[1]), 3))

def rdp_open(points, epsilon):
    if len(points) <= 2:
        return points
    p1 = np.array(points[0])
    p2 = np.array(points[-1])
    line_vec = p2 - p1
    line_len = np.linalg.norm(line_vec)
    
    if line_len > 1e-6:
        unit_vec = line_vec / line_len
        vecs = np.array(points[1:-1]) - p1
        proj_lens = np.dot(vecs, unit_vec)
        perp_vecs = vecs - np.outer(proj_lens, unit_vec)
        dists = np.linalg.norm(perp_vecs, axis=1)
        dmax = np.max(dists)
        index = np.argmax(dists) + 1
    else:
        dists = np.linalg.norm(np.array(points[1:-1]) - p1, axis=1)
        dmax = np.max(dists)
        index = np.argmax(dists) + 1
        
    if dmax > epsilon:
        rec1 = rdp_open(points[:index+1], epsilon)
        rec2 = rdp_open(points[index:], epsilon)
        return rec1[:-1] + rec2
    else:
        return [points[0], points[-1]]

def rdp_closed(loop, epsilon):
    n = len(loop)
    half = n // 2
    part1 = rdp_open(loop[:half+1], epsilon)
    part2 = rdp_open(loop[half:] + [loop[0]], epsilon)
    return part1[:-1] + part2[:-1]

def extract_loops(image_path, sigma=1.0, level=0.5):
    im = Image.open(image_path).convert('L')
    mask = (np.array(im) < 128).astype(float)
    mask = np.pad(mask, 4, mode='constant', constant_values=0.0)
    blurred = gaussian_filter(mask, sigma=sigma)
    
    h, w = blurred.shape
    segments = []
    
    for r in range(h - 1):
        for c in range(w - 1):
            v0 = blurred[r, c]
            v1 = blurred[r, c+1]
            v2 = blurred[r+1, c+1]
            v3 = blurred[r+1, c]
            
            idx = int(v0 >= level) * 8 + int(v1 >= level) * 4 + int(v2 >= level) * 2 + int(v3 >= level)
            if idx == 0 or idx == 15:
                continue
                
            top = interp((c, r), (c+1, r), v0, v1, level)
            right = interp((c+1, r), (c+1, r+1), v1, v2, level)
            bottom = interp((c, r+1), (c+1, r+1), v3, v2, level)
            left = interp((c, r), (c, r+1), v0, v3, level)
            
            if idx in (1, 14):
                segments.append((bottom, left) if idx == 1 else (left, bottom))
            elif idx in (2, 13):
                segments.append((right, bottom) if idx == 2 else (bottom, right))
            elif idx in (3, 12):
                segments.append((right, left) if idx == 3 else (left, right))
            elif idx in (4, 11):
                segments.append((top, right) if idx == 4 else (right, top))
            elif idx == 5:
                segments.append((top, left))
                segments.append((right, bottom))
            elif idx == 10:
                segments.append((left, bottom))
                segments.append((top, right))
            elif idx in (6, 9):
                segments.append((top, bottom) if idx == 6 else (bottom, top))
            elif idx in (7, 8):
                segments.append((left, top) if idx == 8 else (top, left))
                
    start_map = {}
    for s_idx, (p_start, p_end) in enumerate(segments):
        key = (int(round(p_start[0] * 10)), int(round(p_start[1] * 10)))
        start_map.setdefault(key, []).append(s_idx)
        
    used = set()
    loops = []
    
    for i in range(len(segments)):
        if i in used:
            continue
        loop = [segments[i][0]]
        curr_end = segments[i][1]
        used.add(i)
        
        while True:
            key = (int(round(curr_end[0] * 10)), int(round(curr_end[1] * 10)))
            candidates = [c for c in start_map.get(key, []) if c not in used]
            if not candidates:
                for dx in (-1, 0, 1):
                    for dy in (-1, 0, 1):
                        k2 = (key[0] + dx, key[1] + dy)
                        candidates.extend([c for c in start_map.get(k2, []) if c not in used])
            if not candidates:
                break
                
            dists = [np.hypot(segments[c][0][0] - curr_end[0], segments[c][0][1] - curr_end[1]) for c in candidates]
            best_c = candidates[np.argmin(dists)]
            used.add(best_c)
            loop.append(segments[best_c][0])
            curr_end = segments[best_c][1]
            
            if np.hypot(curr_end[0] - loop[0][0], curr_end[1] - loop[0][1]) < 0.3 and len(loop) > 10:
                break
                
        if len(loop) > 20:
            loops.append(loop)
            
    return loops

def clamped_bezier(p_prev, p_curr, p_next, p_next2):
    chord = np.hypot(p_next[0] - p_curr[0], p_next[1] - p_curr[1])
    
    t1 = np.array([p_next[0] - p_prev[0], p_next[1] - p_prev[1]]) / 6.0
    t1_len = np.linalg.norm(t1)
    if t1_len > chord / 3.0 and chord > 1e-4:
        t1 = t1 * (chord / 3.0) / t1_len
        
    t2 = np.array([p_next2[0] - p_curr[0], p_next2[1] - p_curr[1]]) / 6.0
    t2_len = np.linalg.norm(t2)
    if t2_len > chord / 3.0 and chord > 1e-4:
        t2 = t2 * (chord / 3.0) / t2_len
        
    cp1 = (p_curr[0] + t1[0], p_curr[1] + t1[1])
    cp2 = (p_next[0] - t2[0], p_next[1] - t2[1])
    return cp1, cp2

def loops_to_svg_path(loops, viewBox_size=24, padding_x=1.2, padding_y=1.2):
    all_pts = [p for l in loops for p in l]
    min_x = min(p[0] for p in all_pts)
    max_x = max(p[0] for p in all_pts)
    min_y = min(p[1] for p in all_pts)
    max_y = max(p[1] for p in all_pts)
    
    w = max_x - min_x
    h = max_y - min_y
    scale = min((viewBox_size - 2 * padding_x) / w, (viewBox_size - 2 * padding_y) / h)
    
    target_w = w * scale
    target_h = h * scale
    offset_x = (viewBox_size - target_w) / 2 - min_x * scale
    offset_y = (viewBox_size - target_h) / 2 - min_y * scale
    
    d_parts = []
    for loop in loops:
        pts = [(p[0] * scale + offset_x, p[1] * scale + offset_y) for p in loop]
        n = len(pts)
        if n < 3:
            continue
        d = f"M {pts[0][0]:.2f} {pts[0][1]:.2f}"
        for i in range(n):
            p_prev = pts[(i - 1) % n]
            p_curr = pts[i]
            p_next = pts[(i + 1) % n]
            p_next2 = pts[(i + 2) % n]
            
            cp1, cp2 = clamped_bezier(p_prev, p_curr, p_next, p_next2)
            
            d += f" C {cp1[0]:.2f} {cp1[1]:.2f}, {cp2[0]:.2f} {cp2[1]:.2f}, {p_next[0]:.2f} {p_next[1]:.2f}"
        d += " Z"
        d_parts.append(d)
        
    return " ".join(d_parts)

if __name__ == '__main__':
    paths_dict = {}
    for name, path, eps, px, py in [
        ('profile', 'd:/Meow/meow-ganics/public/profile_icon_raw.png', 0.8, 1.2, 1.2),
        ('cart', 'd:/Meow/meow-ganics/public/cart_icon_raw.png', 0.8, 0.8, 1.2)
    ]:
        loops = extract_loops(path, sigma=1.0)
        simp_loops = [rdp_closed(l, eps) for l in loops]
        svg_d = loops_to_svg_path(simp_loops, padding_x=px, padding_y=py)
        paths_dict[name] = svg_d
        
        nums = [float(x) for x in re.findall(r'[-+]?\d*\.\d+|\d+', svg_d)]
        xs = nums[0::2]
        ys = nums[1::2]
        print(f'{name}: x in [{min(xs):.2f}, {max(xs):.2f}], y in [{min(ys):.2f}, {max(ys):.2f}]')
        
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd">
  <path d="{svg_d}" />
</svg>'''
        with open(f'd:/Meow/meow-ganics/public/{name}_icon.svg', 'w') as f:
            f.write(svg)

    # Output React components
    cart_tsx = f'''import React from "react";

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
      <path d="{paths_dict['cart']}" />
    </svg>
  );
}}
'''

    profile_tsx = f'''import React from "react";

interface ProfileIconProps extends React.SVGProps<SVGSVGElement> {{
  className?: string;
}}

export default function ProfileIcon({{ className = "w-6 h-6", ...props }}: ProfileIconProps) {{
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      className={{className}}
      {{...props}}
    >
      <path d="{paths_dict['profile']}" />
    </svg>
  );
}}
'''

    with open('d:/Meow/meow-ganics/src/components/CartIcon.tsx', 'w', encoding='utf-8') as f:
        f.write(cart_tsx)

    with open('d:/Meow/meow-ganics/src/components/ProfileIcon.tsx', 'w', encoding='utf-8') as f:
        f.write(profile_tsx)

    cat_profile_compat = '''import React from "react";
import ProfileIcon from "@/components/ProfileIcon";

export default function CatProfileIcon(props: React.ComponentProps<typeof ProfileIcon>) {
  return <ProfileIcon {...props} />;
}
'''
    with open('d:/Meow/meow-ganics/src/components/CatProfileIcon.tsx', 'w', encoding='utf-8') as f:
        f.write(cat_profile_compat)

    print("Successfully generated CartIcon.tsx, ProfileIcon.tsx, and updated CatProfileIcon.tsx!")
