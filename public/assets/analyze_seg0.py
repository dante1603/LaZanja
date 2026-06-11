from PIL import Image

btn1 = Image.open('c:/Users/GLADIS/Documents/LaGrieta/assets/btn1.png')
btn2 = Image.open('c:/Users/GLADIS/Documents/LaGrieta/assets/btn2.png')

def print_seg0(btn, name):
    w, h = btn.size
    pixels = btn.load()
    has_alpha = (btn.mode == 'RGBA')
    
    # We want to find the first white segment (the icon on the left)
    # Let's search from x=20 to 80, y=15 to h-15
    ymin, ymax = h, 0
    xmin, xmax = w, 0
    
    for y in range(15, h - 15):
        for x in range(20, 80):
            pixel = pixels[x, y]
            r, g, b = pixel[:3]
            a = pixel[3] if has_alpha else 255
            is_white = (r > 240 and g > 240 and b > 240) and (a > 100)
            if is_white:
                ymin = min(ymin, y)
                ymax = max(ymax, y)
                xmin = min(xmin, x)
                xmax = max(xmax, x)
                
    print(f"\n{name} Icon Segment:")
    print(f"  Bounds: x:{xmin}-{xmax}, y:{ymin}-{ymax}")
    
    # Print ASCII
    sw = xmax - xmin + 1
    sh = ymax - ymin + 1
    if sw > 0 and sh > 0:
        grid = [[' ' for _ in range(40)] for _ in range(20)]
        for y in range(ymin, ymax + 1):
            for x in range(xmin, xmax + 1):
                pixel = pixels[x, y]
                r, g, b = pixel[:3]
                a = pixel[3] if has_alpha else 255
                is_white = (r > 240 and g > 240 and b > 240) and (a > 100)
                if is_white:
                    gx = (x - xmin) * 39 // sw
                    gy = (y - ymin) * 19 // sh
                    grid[gy][gx] = '#'
        for row in grid:
            print("  " + "".join(row))

print_seg0(btn1, "Button 1 (Left / Incorrecto)")
print_seg0(btn2, "Button 2 (Right / Correcto)")
