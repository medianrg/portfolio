# medianrg.com

Portofoliul lui Mihai Mări. Un singur ecran care își schimbă starea: un meniu-capsulă cu un companion portocaliu, proiectele blurate în fundal, trase în focus pe Work, și câte o pagină pentru fiecare proiect.

Site static, făcut cu [Astro](https://astro.build). Fără bază de date, fără chei, fără servicii externe.

## Rulare locală

Ai nevoie de Node 22 sau mai nou.

```bash
npm install
npm run dev      # http://localhost:4321, se actualizează singur la fiecare salvare
npm run build    # varianta finală, în dist/
npm run preview  # verifici varianta finală local
```

## Unde schimbi ce

| Ce | Unde |
| --- | --- |
| Textele generale: titlu, About, experiență, contact, replicile companionului | `src/data/site.ts` |
| Proiectele: text, imagini, ordine | `src/content/projects/<nume>/index.md` |
| Culori, umbre, fonturi, dimensiuni | `src/styles/global.css` (variabilele de sus, `:root`) |
| Pozițiile cardurilor din fundal | `src/lib/layout.ts` |
| Structura paginii | `src/components/App.astro`, `Project.astro`, `About.astro` |
| Comportament: stări, animații, tastatură, swipe | `src/scripts/app.ts` |

Textul scris `[între paranteze drepte]` e încă de completat. Vezi lista de la final.

## Imagini la un proiect

Pui fișierele în folderul proiectului, lângă `index.md`, și le numești în `index.md`:

```yaml
cover: ./cover.png          # imaginea de pe card
coverAlt: Ecranul 3D cu gimbal
hero: ./hero.png            # imaginea mare de sus, din pagina proiectului (dacă lipsește, se folosește cover)
heroAlt: Vedere de ansamblu
gallery:
  - src: ./flow.png         # lată, pe toată lățimea
    alt: Fluxul de cumpărare
    wide: true
  - src: ./detail-1.png     # fără wide: câte două pe rând
    alt: Detaliu
  - src: ./detail-2.png
    alt: Alt detaliu
```

PNG sau JPG, exportate mare. Site-ul face singur variantele mici (AVIF și WebP) pentru fiecare ecran.

| Imagine | Cum apare | Dimensiune bună |
| --- | --- | --- |
| `cover` | Umple zona de sus a cardului și se taie din margini. Ține subiectul spre centru. | 1400 × 1200 (cam 7:6) |
| `hero` și `wide: true` | Pe toată lățimea, netăiate. | 2400 lățime, orice înălțime |
| restul din `gallery` | Două pe rând, netăiate. Dă-le aceeași proporție ca să stea aliniate. | 1400 lățime |

Cât timp un proiect nu are imagini, apar zone goale în culoarea `tint`. Când nu le mai vrei, pune `showPlaceholders: false` în `src/data/site.ts`.

## Video loops

Clipurile stau în `public/media/<proiect>/` și le numești cu calea care începe cu `/media/`:

```yaml
coverVideo: /media/smilecloud-3d/gimbal.mp4   # pe card; pornește doar când cardul e în focus
heroVideo: /media/smilecloud-3d/intro.mp4     # sus, în pagina proiectului
gallery:
  - video: /media/smilecloud-3d/rotate.mp4
    poster: ./rotate.png                      # imaginea afișată până se încarcă
    alt: Rotirea modelului
```

MP4 (H.264), fără sunet, scurte (4–8 secunde), ideal sub 2–3 MB. Rulează în buclă doar cât sunt pe ecran. Dacă vizitatorul are „reduce motion” activ, nu pornesc singure.

## Proiect nou, ordine, ștergere

- **Nou:** copiezi un folder din `src/content/projects/`, îl redenumești și editezi `index.md`. Numele folderului devine adresa: `red-p` → `/work/red-p/`.
- **Ordine:** câmpul `order`.
- **Ștergere:** ștergi folderul.

Pozițiile cardurilor din fundal sunt gândite pentru șase proiecte. Merg și cu mai multe sau mai puține, dar merită verificate vizual.

## Companionul

În `src/data/site.ts`:

- `hello` e ce spune la prima vizită.
- `lines` sunt replicile de la click pe el, pe prima pagină, pe rând. Ține-le sub ~32 de caractere ca să încapă în capsulă pe telefon.

Click pe el pe orice altă pagină duce acasă.

## Publicare

După ce legi repo-ul de Vercel, orice push pe `main` publică site-ul, iar orice alt branch primește un link de preview.

Legarea, o singură dată: vercel.com → Add New → Project → `medianrg/portfolio` → Deploy (Vercel recunoaște Astro singur). Apoi Settings → Domains → `medianrg.com` și urmezi instrucțiunile DNS de acolo.

## Pe viitor

- **Formular de contact:** are nevoie de o funcție pe server (pe Vercel, cu `@astrojs/vercel`). Cheia serviciului de email stă doar în variabilele de mediu din Vercel, niciodată în cod.
- **Calendly:** un rând „Book a call” în panoul Contact.

Panoul Contact din `App.astro` are loc pentru amândouă.

## De completat

- `src/data/site.ts`: anul de început la 3Pillar Global (`[start]`), perioada Softbinator, perioada Smilecloud, numele corect la `[e-spres-oh]`.
- `churches-of-zurich`: clientul.
- `hands-on-learning`: `context` și `outcome`.
- CV-ul: acum linkul duce la PDF-ul de pe site-ul vechi. Pune PDF-ul în `public/` și schimbă linkul în `/CV_Mihai_Mari.pdf`.
- Imaginile și clipurile proiectelor.
- `public/og.png`: imaginea care apare când dai share la link. Merită refăcută după ce intră imaginile.
