# Atelier Pocket Memory

Les sources des boîtes Pocket Memory. Chaque boîte est construite en **un seul fichier HTML autonome** (Three.js r128, images, sons et musique inclus), publié sur GitHub Pages dans `pocket-memory/<nom-de-la-boite>/`.

**Les boîtes ne sont pas numérotées** (ni dans le jeu, ni dans les adresses, ni sur Notion) : l'ordre peut changer. On les désigne par leur titre, en minuscules et sans accents (`le-prix-de-l-ecriture`).

> Les règles de contenu (histoire, style, activités, souvenirs) sont dans le projet claude.ai « Pocket Memory » :
> `socle-commun.md`, `bible-histoire-alice.md`, `charte-graphique.md`, `regle-des-activites.md`, `regle-des-souvenirs.md`, `kit-demarrage.md`.
> Ce dossier-ci ne contient que la technique.

## Le socle commun : ne pas y toucher boîte par boîte

Une nouvelle boîte **part toujours d'une copie** de `le-prix-de-l-ecriture/`. Restent identiques dans toutes les boîtes (détail et valeurs dans `socle-commun.md`) :
- Alice (`C_alice.js`) et sa marche (`J_main.js`, partie « marche » : vitesse max 2,85, accélération 9, freinage 12, rotation 14) ; le chemin A* (`K_path.js`) ;
- les gestes, le zoom, la caméra et ses états, l'effet maquette (`J_main.js`, `D_post.js`) ;
- la bulle d'Alice, le panneau de texte, les boutons, l'écran d'accueil, l'écran de secours, l'intégration Notion (`head.html`, `J_main.js`) ;
- le déroulé d'un lieu, les languettes, le journal (`I_flow.js` : mécanique ; `R_journal.js`) ; le mode Rappel (`W_recall.js`) ; les sons (`U_music.js`).

Changent d'une boîte à l'autre : la carte et ses lieux (`F_box.js`), les souvenirs (`G_scenes.js`, `REVEAL` dans `R_journal.js`), les activités (`V_acts.js`, `X_ia.js`), le contenu du scénario (`SCRIPTS` dans `I_flow.js`), le carnet (`Y_carnet.js`), les cartes et l'argument du Rappel, le titre et l'image d'accueil (`head.html`). Une amélioration du socle se reporte dans **toutes** les boîtes.

## Construire et publier une boîte

```bash
cd atelier/le-prix-de-l-ecriture
python3 build.py                 # écrit ../../pocket-memory/le-prix-de-l-ecriture/index.html et vérifie la syntaxe
python3 ../outils/err.py ../../pocket-memory/le-prix-de-l-ecriture/index.html     # erreurs JavaScript au chargement
python3 ../outils/auto.py ../../pocket-memory/le-prix-de-l-ecriture/index.html 20 15000   # parcours complet (lent, en arrière-plan)
git add -A && git commit -m "…" && git push   # en ligne 1 à 2 minutes plus tard
```

Pré-requis : Python 3 avec Playwright et Chromium, Node (pour la vérification de syntaxe). Le rendu WebGL en test passe par SwiftShader (logiciel) : c'est lent. Pour une scène précise, utiliser `outils/scene.py`, qui simule l'horloge (`outils/clock.js`, fonction `__step(ms)`).

## Organisation d'une boîte

- `head.html` : tout ce qui précède le code de la scène : styles, écran d'accueil (image intégrée en base64), panneaux HTML (bulle, carnet, boutons), Three.js r128 et ses passes de post-traitement, création du moteur de rendu avec solutions de secours pour mobile, détection de l'intégration Notion (`html.embed`). Se termine par la création de la caméra.
- `modules/*.js` : concaténés dans cet ordre (voir `build.py`) à l'intérieur de `window.__boot=()=>{ … }`.
- `assets/music.b64` : la musique (« Snowfall », Scott Buckley, CC-BY 4.0), en base64.

| Module | Rôle |
|---|---|
| `A_env` | mode papier (`PAPER`) ou plastique (`#plastique`), lumières de fin de journée, matériaux |
| `B_paint` | outils de peinture sur canvas (textures, couleurs) |
| `F_box` | la boîte en carton et la carte : terre, mer, lieux, décor pop-up, phare, scotch, fil rouge |
| `P_people` | silhouettes des personnages des souvenirs |
| `G_scenes` | les décors des souvenirs |
| `H_manips` | base des activités (`txt` : texte manuscrit sur canvas) |
| `R_journal` | le panneau du couvercle : souvenirs en papier découpé, languettes (`REVEAL`, `drawTab`), journal d'Alice |
| `S_chibi` | Alice dessinée par elle-même, dans la marge |
| `T_manpaper` | décors des activités en papier découpé |
| `V_acts` | les activités des quatre premiers lieux (pierres, théâtre, Thot, phares) |
| `C_alice` | la figurine 3D d'Alice |
| `I_flow` | **le scénario** : `SCRIPTS` (intro, lieux 0 à 4), étapes `say` / `mem` / `note` / `manip`, constellation |
| `D_post` | effet maquette (flou), calque |
| `K_path` | déplacements d'Alice sur la carte (A*) |
| `U_music` | musique et volume |
| `W_recall` | mode Rappel : cartes, argument à réécrire |
| `X_ia` | le lieu « Aujourd'hui » (l'IA) |
| `Z_dio` | **les souvenirs en boîte** : le joueur crayonne le souvenir sur une feuille du carnet, le dessin devient une boîte-cadre en carton qu'on tourne au doigt, un détail caché sur une paroi (`DIOHID`), puis l'étoile |
| `Y_carnet` | le carnet de papa (notes de lecture et sources) |
| `J_main` | boucle principale, caméra, gestes, bulle d'Alice, écran d'accueil, hooks de test |

## Tests

Avec `#test` dans l'adresse, l'écran d'accueil est sauté et `window.__T` donne accès à : `manip('t'|'h'|'p'|'a'|'i'|'g')`, `mdown/mmove/mup(x,y)` (coordonnées du canvas 768×768), `lidcam(id, qui, texte)`, `tab(0|1)`, `note(texte)`, `st()`, `fp()`, `solve()`, `advance()`. Variantes : `#test-jumpN` (commencer au lieu N), `#test-auto` (parcours automatique), `#test-rappel`.

## Pièges connus

- Pas de faces au même niveau que le sol : enfoncer légèrement les disques et socles (sinon scintillement de loin).
- Texte sur les dessins 768 px : environ 40 px minimum (lisible dans l'intégration Notion sur téléphone).
- Courbes `rr()` : coins en courbes quadratiques, pas en arcs de cercle (le milieu d'un coin est à `w - r/4`).
- Mémoire mobile : textures plafonnées (`LOW`), ombres 1024 sur mobile ; un écran de secours propose de rouvrir si le contexte WebGL est perdu.
- Le dépôt est public : n'y mettre rien de confidentiel. Le PDF du livre n'y va jamais.

## Démarrer une nouvelle boîte

```bash
cp -r atelier/le-prix-de-l-ecriture atelier/<nom-de-la-nouvelle-boite>
```
Puis modifier dans le nouveau dossier : le titre et l'image de l'écran d'accueil (`head.html`), la carte et les lieux (`F_box`), les souvenirs (`G_scenes`, `R_journal`), les activités (`V_acts`, `X_ia`), le scénario (`I_flow`), le carnet (`Y_carnet`), le Rappel (`W_recall`). Ajouter la boîte à la liste de `pocket-memory/index.html`. Les anciennes adresses `boite-1/` et `pocket-memory/boite-1/` redirigent vers `pocket-memory/le-prix-de-l-ecriture/`.
