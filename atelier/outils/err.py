"""Ouvre la boîte dans Chromium et affiche les erreurs JavaScript. Usage : python3 err.py chemin/vers/index.html"""
import asyncio,sys,os
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'])
        m=await b.new_page(viewport={'width':390,'height':844});errs=[]
        m.on('pageerror',lambda e:errs.append(str(e)));m.on('console',lambda c:errs.append(c.text[:200]) if c.type=='error' else None)
        await m.goto('file://'+os.path.abspath(sys.argv[1])+'#test');await m.wait_for_timeout(4000);await b.close()
        print('ERREURS',errs[:5] if errs else 'aucune')
asyncio.run(main())
