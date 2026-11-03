"""Parcours automatique complet (#test-auto) : capture d'écran régulière + état. Usage : python3 auto.py index.html [n=20] [ms=15000]
Lent avec le rendu logiciel (plusieurs minutes) : à lancer en arrière-plan."""
import asyncio,sys,os
from playwright.async_api import async_playwright
async def main():
    f=os.path.abspath(sys.argv[1]);n=int(sys.argv[2]) if len(sys.argv)>2 else 20;w=int(sys.argv[3]) if len(sys.argv)>3 else 15000
    os.makedirs('captures',exist_ok=True)
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'])
        ctx=await b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
        m=await ctx.new_page();errs=[];m.on('pageerror',lambda e:errs.append(str(e)))
        await m.goto('file://'+f+'#test-auto')
        for i in range(n):
            await m.wait_for_timeout(w)
            print(i,await m.evaluate('window.__T?JSON.stringify([window.__T.st().next,window.__T.fp()]):""'),flush=True)
            await m.screenshot(path=f'captures/auto{i:02d}.png')
        print('ERREURS',errs[:5]);await b.close()
asyncio.run(main())
