"""Construit la boîte : head.html + modules/*.js + musique -> un seul fichier HTML autonome.
Usage : python3 build.py [sortie]   (par défaut : ../../pocket-memory/boite-1/index.html)"""
import os,sys,subprocess
D=os.path.dirname(os.path.abspath(__file__))
ORDRE=['A_env','B_paint','F_box','P_people','G_scenes','H_manips','R_journal','S_chibi','T_manpaper','V_acts','C_alice','I_flow','D_post','K_path','U_music','W_recall','X_ia','Y_carnet','J_main']
out=sys.argv[1] if len(sys.argv)>1 else os.path.join(D,'..','..','pocket-memory',os.path.basename(D),'index.html')
head=open(os.path.join(D,'head.html')).read()
parts=[open(os.path.join(D,'modules',m+'.js')).read() for m in ORDRE]
music=open(os.path.join(D,'assets','music.b64')).read()
html=head+'\n'.join(parts)+'\n};requestAnimationFrame(()=>setTimeout(window.__boot,60));\n</script>\n<script>window.MUSIC_SRC="data:audio/mp4;base64,'+music+'";</script>\n'
os.makedirs(os.path.dirname(os.path.abspath(out)),exist_ok=True);open(out,'w').write(html)
js=html.split('<script>')[1].split('</script>')[0]
r=subprocess.run(['node','-e',"const fs=require('fs');try{new Function(fs.readFileSync(0,'utf8'));console.log('syntaxe ok')}catch(e){console.log('ERREUR',e.message);process.exit(1)}"],input=js,text=True,capture_output=True)
print(os.path.abspath(out),round(len(html)/1e6,2),'Mo',r.stdout.strip() or r.stderr.strip())
