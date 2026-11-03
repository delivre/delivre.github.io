"""Capture une scène précise avec l'horloge simulée (rapide et déterministe).
Exemple : python3 scene.py index.html "manip('t')" theatre.png
Hooks utiles (window.__T, actifs avec #test) : manip('t'|'h'|'p'|'a'|'i'|'g'), mdown(x,y), mmove, mup,
lidcam('echo'|'maman'|'papa'|'phare'|'ia', qui, texte), tab(0|1), note(texte), st(), fp(), solve(), advance()."""
import asyncio,sys,os
from playwright.async_api import async_playwright
CLOCK=os.path.join(os.path.dirname(os.path.abspath(__file__)),'clock.js')
async def main():
    f=os.path.abspath(sys.argv[1]);js=sys.argv[2] if len(sys.argv)>2 else '';out=sys.argv[3] if len(sys.argv)>3 else 'scene.png'
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'])
        m=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2);m.set_default_timeout(300000)
        await m.add_init_script(path=CLOCK);await m.goto('file://'+f+'#test-jump1',wait_until='domcontentloaded');await m.wait_for_timeout(6000)
        async def ff(s):
            for _ in range(int(s*15)): await m.evaluate('__step(66.67)')
        await ff(1.5);await m.mouse.click(195,420);await ff(5)
        for part in [x for x in js.split(';') if x.strip()]:
            await m.evaluate('window.__T.'+part.strip());await ff(2)
        await m.screenshot(path=out);await b.close();print(out)
asyncio.run(main())
