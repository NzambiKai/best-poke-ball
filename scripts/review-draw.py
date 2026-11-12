"""Draw contact sheets from the JSON written by review-sheet.mjs."""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

payload = json.loads(sys.stdin.read())
root = Path(payload["root"])
out_dir = Path(payload["outDir"])
rows = payload["rows"]
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
bold = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)

WIDTH = 1680
ROW = 112
PER = 24
PAD = 8


def open_image(rel, size):
    path = root / rel
    try:
        image = Image.open(path).convert("RGBA")
    except Exception:
        image = Image.new("RGBA", size, (230, 230, 230, 255))
    image.thumbnail(size, Image.Resampling.LANCZOS)
    plate = Image.new("RGBA", size, (255, 255, 255, 0))
    plate.paste(image, ((size[0] - image.width) // 2, (size[1] - image.height) // 2), image)
    return plate


def chip(hex_color, size=32):
    value = hex_color.lstrip("#")
    rgb = tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))
    image = Image.new("RGB", (size, size), rgb)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, size - 1, size - 1), outline=(40, 40, 40))
    return image


pages = [rows[index : index + PER] for index in range(0, len(rows), PER)]
for page_index, page in enumerate(pages, start=1):
    height = 36 + ROW * len(page) + 8
    sheet = Image.new("RGB", (WIDTH, height), (248, 244, 238))
    draw = ImageDraw.Draw(sheet)
    draw.text((PAD, 8), f"Ball review {page_index}/{len(pages)}", fill=(40, 30, 30), font=bold)
    for row_index, row in enumerate(page):
        top = 36 + row_index * ROW
        if row_index % 2 == 0:
            draw.rectangle((0, top, WIDTH, top + ROW), fill=(255, 252, 247))
        sprite = open_image(row["sprite"], (96, 96))
        sheet.paste(sprite, (PAD, top + 8), sprite)
        draw.text((112, top + 18), row["name"], fill=(30, 24, 28), font=bold)
        draw.text((112, top + 42), row["slug"], fill=(110, 100, 96), font=small)
        x = 360
        for color in row["colors"][:6]:
            sheet.paste(chip(color["hex"]), (x, top + 22))
            draw.text((x, top + 58), f"{int(round(color['share'] * 100))}%", fill=(60, 54, 50), font=small)
            x += 40
        neutral = row.get("neutral") or {}
        note = []
        for name in ("black", "gray", "white"):
            share = neutral.get(name) or 0
            if share >= 0.03:
                note.append(f"{name[0]}{int(round(share * 100))}")
        if note:
            draw.text((x + 4, top + 40), " ".join(note), fill=(110, 100, 96), font=small)
        bx = 760
        for pick_index, pick in enumerate(row["picks"]):
            icon = open_image(f"assets/items/{pick['id']}.png", (56, 56))
            sheet.paste(icon, (bx, top + 12), icon)
            label = f"{pick_index + 1} {pick['name']}{'*' if pick['loose'] else ''}"
            fill = (150, 40, 40) if pick["castOnly"] else (30, 24, 28)
            draw.text((bx + 62, top + 22), label, fill=fill, font=font)
            draw.text((bx + 62, top + 46), str(pick["score"]), fill=(110, 100, 96), font=small)
            bx += 280
    target = out_dir / f"sheet-{page_index}.png"
    sheet.save(target, "PNG")
    print(target)
