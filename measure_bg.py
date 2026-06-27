from PIL import Image
import os

packs = {
  'w1-lab': [
    "D:/Progamming/Project dan SourceCode/BEBAS CAMPURAN/Game Action Koki/Aset ZIP/extracted/bg-w1-lab/Scifi lab Files/layers/back.png",
    "D:/Progamming/Project dan SourceCode/BEBAS CAMPURAN/Game Action Koki/Aset ZIP/extracted/bg-w1-lab/Scifi lab Files/layers/middle.png",
    "D:/Progamming/Project dan SourceCode/BEBAS CAMPURAN/Game Action Koki/Aset ZIP/extracted/bg-w1-lab/Scifi lab Files/layers/front.png",
  ],
  'w2-synth': [
    "D:/Progamming/Project dan SourceCode/BEBAS CAMPURAN/Game Action Koki/Aset ZIP/extracted/bg-w2-synth/Miami-synth-files/Layers/back.png",
    "D:/Progamming/Project dan SourceCode/BEBAS CAMPURAN/Game Action Koki/Aset ZIP/extracted/bg-w2-synth/Miami-synth-files/Layers/buildings.png",
    "D:/Progamming/Project dan SourceCode/BEBAS CAMPURAN/Game Action Koki/Aset ZIP/extracted/bg-w2-synth/Miami-synth-files/Layers/highway.png",
  ],
  'w3-city': [
    "D:/Progamming/Project dan SourceCode/BEBAS CAMPURAN/Game Action Koki/Aset ZIP/extracted/bg-w3-city/Warped City Phaser/assets/environment/bg-1.png",
    "D:/Progamming/Project dan SourceCode/BEBAS CAMPURAN/Game Action Koki/Aset ZIP/extracted/bg-w3-city/Warped City Phaser/assets/environment/bg-2.png",
    "D:/Progamming/Project dan SourceCode/BEBAS CAMPURAN/Game Action Koki/Aset ZIP/extracted/bg-w3-city/Warped City Phaser/assets/environment/bg-3.png",
  ],
  'w4-corridors': [
    "D:/Progamming/Project dan SourceCode/BEBAS CAMPURAN/Game Action Koki/Aset ZIP/extracted/bg-w4-corridors/Cold Corridors Files/Assets/Layers/back.png",
    "D:/Progamming/Project dan SourceCode/BEBAS CAMPURAN/Game Action Koki/Aset ZIP/extracted/bg-w4-corridors/Cold Corridors Files/Assets/Layers/middle.png",
    "D:/Progamming/Project dan SourceCode/BEBAS CAMPURAN/Game Action Koki/Aset ZIP/extracted/bg-w4-corridors/Cold Corridors Files/Assets/Layers/near.png",
  ],
}

for pack, files in packs.items():
    print(f'=== {pack} ===')
    for f in files:
        img = Image.open(f)
        w, h = img.size
        name = os.path.basename(f)
        print(f'  {name}: {w}x{h}')
