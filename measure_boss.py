from PIL import Image
import os

packs = {
  'hero-knight': 'D:/Progamming/Project dan SourceCode/BEBAS CAMPURAN/Game Action Koki/Aset ZIP/extracted/hero-knight/Hero Knight/Sprites',
  'hero-knight-2': 'D:/Progamming/Project dan SourceCode/BEBAS CAMPURAN/Game Action Koki/Aset ZIP/extracted/hero-knight-2/Hero Knight 2/Sprites',
  'medieval-king': 'D:/Progamming/Project dan SourceCode/BEBAS CAMPURAN/Game Action Koki/Aset ZIP/extracted/medieval-king/Medieval King Pack',
  'fantasy-warrior': 'D:/Progamming/Project dan SourceCode/BEBAS CAMPURAN/Game Action Koki/Aset ZIP/extracted/fantasy-warrior/Fantasy Warrior/Sprites',
  'evil-wizard-2': 'D:/Progamming/Project dan SourceCode/BEBAS CAMPURAN/Game Action Koki/Aset ZIP/extracted/evil-wizard-2/EVil Wizard 2/Sprites',
}

for pack, path in packs.items():
    print(f'=== {pack} ===')
    for f in sorted(os.listdir(path)):
        if f.endswith('.png'):
            img = Image.open(os.path.join(path, f))
            w, h = img.size
            frames = w // h if h > 0 else '?'
            print(f'  {f}: {w}x{h} frameH={h} frames={frames}')
