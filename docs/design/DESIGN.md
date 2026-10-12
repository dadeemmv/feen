---
name: Borgo
description: App di educazione finanziaria (nome di lavoro). Premium come Bending Spoons, giocosa come la FIFA City di FIFA 12 su Wii.
colors:
  ink: "#000000"
  ink-2: "#444444"
  muted: "#6B6B6B"
  line: "rgba(0,0,0,.08)"
  fill: "rgba(0,0,0,.055)"
  paper: "#FFFFFF"
  surface: "#F4F4F4"
  night: "#000000"
  night-2: "#161616"
  contract: "#F6F1E6"
  sprout: "#CFF56A"
  sprout-2: "#B8E04F"
  sprout-deep: "#3F5A00"
  thread: "#D42B26"
  honey: "#FFB627"
  honey-tint: "#FFF0CC"
  honey-deep: "#7A4A00"
  cobalt: "#3B5BFF"
  cobalt-tint: "#DDE3FF"
  cobalt-deep: "#16247A"
  lagoon: "#1FBFB0"
  lagoon-tint: "#D2F4F0"
  lagoon-deep: "#0A554E"
  coral: "#FF5B3A"
  coral-tint: "#FFE0D8"
  coral-deep: "#8A2310"
  mint: "#2E9E6B"
  mint-tint: "#DCF2E5"
  leaf: "#6CC04A"
  leaf-tint: "#E3F4CC"
  wheat-tint: "#FFEBB8"
  stone: "#9C9384"
  stone-tint: "#ECE9E3"
  wood: "#C49460"
  wood-tint: "#F3E6D3"
  ok: "#E9F9D0"
  ok-line: "#7DB321"
  no: "#FFE6E1"
  disabled: "#E8E8E8"
  sign: "#1B2A8A"
typography:
  display:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 8.4vw, 7rem)"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "clamp(-0.055em, calc(-0.02em - 0.3vw), -0.04em)"
  headline:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.375rem, 5.6vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "clamp(-0.045em, calc(-0.015em - 0.25vw), -0.035em)"
  accent:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontWeight: 400
    letterSpacing: "-0.01em"
  title-block:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1.5vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-card:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.35
  code:
    fontFamily: "Fragment Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.04em"
  numeral:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(3.5rem, 7vw, 6rem)"
    fontWeight: 400
    lineHeight: 1
rounded:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "28px"
  xl: "36px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
  section: "120px"
  section-mobile: "80px"
  gutter: "24px"
  gutter-mobile: "16px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.body-card}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "52px"
  button-on-dark:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "52px"
  button-secondary:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "52px"
  button-disabled:
    backgroundColor: "{colors.disabled}"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    height: "52px"
  pill-nav:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "36px"
  chip:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "28px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
  card-on-surface:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "24px"
  card-on-dark:
    backgroundColor: "{colors.night-2}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "24px"
  option-answer:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "18px"
    padding: "10px 14px"
    height: "48px"
  option-answer-correct:
    backgroundColor: "{colors.ok}"
    rounded: "18px"
  option-answer-wrong:
    backgroundColor: "{colors.no}"
    rounded: "18px"
  toast-reward:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "10px 12px 10px 10px"
  counter:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 12px 0 8px"
    height: "34px"
  choice-inline:
    backgroundColor: "{colors.sprout}"
    textColor: "{colors.ink}"
    rounded: "6px"
    padding: "0 6px"
  contract:
    backgroundColor: "{colors.contract}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "32px"
---

# Design System: Borgo

## Overview

**Creative North Star: "Il plastico in galleria"**

Una galleria bianca e nera, sobria come il sito di Bending Spoons, e al centro un plastico colorato fatto a mano: il borgo, i quattro animali, il patto con la ceralacca. La struttura sta zitta e lascia parlare il mondo. Titoli grandi in peso regular, superfici piene senza bordi, pillole nere e bianche: questa è la galleria. Personaggi con volume, edifici isometrici con la luce da sinistra, la carta calda del patto: questo è il plastico. Le due parti non si mescolano. Il colore che vive nel mondo non sale sull'interfaccia, e l'interfaccia non diventa mai un giocattolo.

Il tono è **sicuro, caldo e spiritoso**. Sicuro nei titoli enormi e nelle pillole che dicono cosa fanno. Caldo nei personaggi, nella socia che parla e nella carta del patto. Spiritoso in una parola in corsivo per titolo e in un premio che rimbalza. La densità è bassa: molto bianco, una cosa per volta, numeri grandi al posto delle barre. Il progresso si vede nel mondo (un edificio a metà, un abitante in più), non in percentuali.

Rifiuti confermati: l'aspetto da app per bambini (illustrazioni piatte, colori ovunque) e l'aspetto da dashboard (bordi da 1 px, griglie di barre, etichette tecniche dappertutto).

**Key Characteristics:**
- Bianco e nero puri come struttura; colore solo nel mondo e nei premi.
- Titoli in Instrument Sans regular, con una sola parola in Instrument Serif corsivo.
- Card piene, senza bordi, raggi da 28 a 50 px, con l'alone del loro colore sotto.
- Volume (luce, ombre morbide, riflessi) solo in borgo, personaggi e oggetti.
- Movimento rapido e pulito per navigare, la molla solo per premi, personaggi e ceralacca.

## Colors

Una galleria bianca e nera con un solo verde luminoso per i premi, un rosso per il filo del patto e quattro famiglie di colore che appartengono ai personaggi.

### Primary
- **Nero inchiostro** (ink): testo, bottoni principali, sezioni scure, anello del focus. È il colore che agisce.
- **Bianco galleria** (paper): sfondo dell'app, bottoni sul nero.

### Secondary
- **Germoglio** (sprout): la superficie dei momenti premio (patto firmato, edificio finito), la parola in corsivo sul nero, il progresso, la selezione del testo. Il suo tono più scuro (sprout-2) fa da sottolineatura alle scelte del patto; il profondo (sprout-deep) porta il segno di spunta.

### Tertiary
- **Filo rosso** (thread): solo il patto e il filo rosso che lega le tappe, compreso il riquadro della firma quando manca la firma. Mai altrove.

### Neutral
- **Grigio scuro** (ink-2): testo secondario e corpo delle card.
- **Grigio etichetta** (muted): etichette e didascalie su bianco. Sulle tinte dei personaggi si usa il tono profondo del personaggio, perché il grigio scende sotto 4,5:1.
- **Superficie** (surface): card piene su bianco; su superficie le card tornano bianche.
- **Notte** (night-2): card sulle sezioni nere.
- **Carta del patto** (contract): l'unico materiale caldo dell'app, con una trama a puntini da 14 px.
- **Linea e velo** (line, fill): divisori tratteggiati del patto e fondo delle pillole secondarie e delle chip.

### Personaggi ed edifici
Ogni personaggio ha tre toni: la base per l'illustrazione, la tinta per gli sfondi, il profondo per il testo sopra la tinta.
- **Miele** (honey): Scoiattolo Custode, Mercato, Granaio.
- **Cobalto** (cobalt): Castoro Ingegnere, Municipio, Torre.
- **Laguna** (lagoon): Lontra Conviviale, Pozzo.
- **Corallo** (coral): Volpe Esploratrice, Bottega, Faro.

Gli edifici che non hanno un personaggio prendono il colore del loro materiale: **Menta** per il Banco (il tetto verde), **Foglia** per il Frutteto, **Grano** per il Granaio, **Pietra** per le Mura, **Legno** per il Ponte.

### Stati
- **Giusto** (ok, ok-line) e **sbagliato** (no, con il bordo corallo): le risposte delle lezioni.
- **Disattivato** (disabled): il tieni premuto prima della firma.
- **Inchiostro della firma** (sign): firma disegnata, firma scritta e cursore del campo.

### Named Rules
**The Gallery Rule.** L'interfaccia è bianca e nera. Il colore entra solo con i personaggi, il borgo e i premi.

**The Sprout Rule.** Il germoglio non è mai un bottone. È una superficie che festeggia o un accento corsivo sul nero.

**The Paper Rule.** La carta calda vive solo nel patto. Se la vedi altrove, è un errore.

**The Red Thread Rule.** Il filo rosso appare solo per il patto e il filo che lega le tappe.

## Typography

**Display Font:** Instrument Sans (con ui-sans-serif, system-ui)
**Body Font:** Instrument Sans
**Accent Font:** Instrument Serif corsivo (con Georgia)
**Label/Mono Font:** Fragment Mono, solo per i codici

**Character:** un sans regolare e asciutto che fa la struttura, un serif corsivo che porta il senso in una parola e nei numeri grandi, un mono che compare solo dove c'è un codice vero. Sono i tre font di Bending Spoons: da valutare più avanti se cambiarne uno per non sembrare un clone.

### Hierarchy
- **Display** (400, da 48 a 112 px, interlinea 0,94, tracking da −5,5% a −4% secondo la larghezza): il titolo d'apertura.
- **Headline** (400, da 38 a 72 px, interlinea 0,98): i titoli di sezione, sempre con una parola in serif corsivo.
- **Title block** (500, 24 px): i titoli dentro una sezione e quelli delle tappe.
- **Title** (500, 20 px, interlinea 1,2): i titoli delle card, degli edifici e dei personaggi.
- **Lead** (400, da 17 a 20 px, interlinea 1,5, al massimo 720 px di riga): l'introduzione di ogni sezione.
- **Body** (400, 16 / 15 / 14 px, interlinea 1,5): corpo del testo, corpo delle card, note e didascalie.
- **Label** (500, 13 px, maiuscole normali): etichette di card, didascalie, nomi delle sezioni.
- **Code** (Fragment Mono 400, 12 px, tracking 4%, maiuscolo): sigle dei personaggi, numero e data del patto, articoli, colori in esadecimale, specifiche.
- **Numeral** (Instrument Serif 400, da 56 a 96 px): numeri grandi nel borgo e nelle statistiche, al posto delle barre.

Il testo è in rem e segue la dimensione scelta nel browser. Grassetto sempre a 600, il peso 700 non si usa. Titoli con a capo bilanciato, paragrafi senza parola sola in fondo.

### Named Rules
**The One Italic Word Rule.** Un titolo ha una sola parola in Instrument Serif corsivo, quella che porta il senso.

**The Regular Rule.** I titoli sono in peso regular: la gerarchia la fa la dimensione, non il grassetto.

**The Code-Only Mono Rule.** Fragment Mono solo per sigle, numeri di patto e articolo, date e specifiche. Etichette e didascalie sono in sans.

## Layout

Una colonna centrale larga al massimo 1160 px, con margini di 24 px (16 sotto i 700 px). Le sezioni respirano: 120 px sopra e sotto, 80 sul telefono. Si alternano sezioni bianche, grigio superficie e nere; la fascia germoglio a tutta larghezza è riservata alla frase per il team e ai momenti premio.

La spaziatura ha base 4 (4, 8, 12, 16, 24, 32, 48, 64). Le card si dispongono in griglie con 16 px di spazio. Punti di rottura dettati dal contenuto: 1080 px (personaggi e patto passano a una colonna), 900 px (griglie a due colonne, carosello che scorre), 700 px (una colonna, borgo che si scorre), 560 px (il bottone del movimento diventa solo icona), 420 px (le griglie di card brevi passano a una colonna).

Sul telefono il borgo non diventa una miniatura: resta largo 620 px, si scorre di lato e parte centrato sul cantiere di oggi. Le file di schermate e il carosello dei personaggi scorrono di lato con l'aggancio al centro.

## Elevation & Depth

L'interfaccia è piatta: niente bordi, niente ombre di elevazione. La profondità delle card viene dall'**alone del loro colore**, un'ombra lunga e morbida della stessa tinta che si apre sotto la card come un riflesso sul pavimento della galleria. Il volume vero vive solo nel mondo: personaggi e borgo hanno la luce da sinistra, ombre morbide a terra verso destra, sfumature sulle facciate (più chiare in alto, più scure alla base) e riflessi su teste e alberi. Gli oggetti fisici, cioè il foglio del patto e i telefoni disegnati, hanno un'ombra calda e diffusa.

### Shadow Vocabulary
- **Alone della card** (`box-shadow: 0 70px 70px -70px <colore base>`): sotto le card dei personaggi e degli edifici.
- **Alone del carosello** (`box-shadow: 0 90px 90px -90px <colore base>`): sotto le card dei personaggi in apertura, sul nero.
- **Ombra della carta** (`box-shadow: 0 40px 80px -40px rgba(60,40,10,.35)`): il foglio del patto.
- **Ombra del dispositivo** (`box-shadow: 0 30px 60px -30px rgba(0,0,0,.45), 0 12px 24px -12px rgba(0,0,0,.25)`): i telefoni disegnati.

### Named Rules
**The No-Line Rule.** Le card non hanno bordi. Si separano per tinta e per alone.

**The Volume-In-The-World Rule.** Luce e ombre sono del borgo, dei personaggi e degli oggetti. L'interfaccia resta piatta.

## Shapes

Forme morbide e piene. I raggi crescono con la dimensione dell'oggetto: 8 px per i campi, 12 per le icone, 20 per le card piccole, 28 per le card, 36 per i fogli e le card dei personaggi, fino a 44 per la matrice dei personaggi e 50 per la card del borgo. Bottoni, chip, contatori e pillole sono sempre a pillola. Il borgo è isometrico, su caselle di 64 × 32; i progetti sono lotti segnati a terra con un picchetto, mai sagome con un lucchetto. La ceralacca ha un bordo ondulato e cade inclinata di −8°.

## Components

### Buttons
Morbidi e decisi: pillole piene che dicono chiaramente cosa fanno.
- **Shape:** pillola (999 px), alta 52 px, padding laterale 22 px, testo 15 px peso 600.
- **Primary:** nero inchiostro con testo bianco su fondo chiaro.
- **On dark:** bianco con testo nero sulle sezioni scure.
- **Secondary:** velo grigio. **Ghost:** trasparente.
- **Glass:** pillola semitrasparente alta 34 px con sfocatura dello sfondo, solo sopra le card degli edifici («Vedi le lezioni ↗»).
- **Hover / Focus / Active:** alla pressione si stringe al 97% in 160 ms; il focus è un anello d'inchiostro di 2,5 px staccato di 3 px, bianco sul nero.
- **Tieni premuto:** il bottone nero si riempie di germoglio da sinistra in 1,1 s mentre lo tieni (anche con spazio o Invio); prima della firma è grigio disattivato e, se lo premi, il riquadro della firma si accende di filo rosso.

### Chips
- **Style:** pillola alta 28 px, velo grigio, testo etichetta. Sulle card dei personaggi il fondo è bianco al 75% e il testo nel tono profondo del personaggio.
- **State:** solo informative; non sono filtri.

### Cards / Containers
- **Corner Style:** 28 px (36 per i personaggi, 34 per gli edifici).
- **Background:** superficie su bianco, bianco su superficie, notte sul nero; tinta del personaggio o del materiale per personaggi ed edifici.
- **Shadow Strategy:** nessuna ombra; alone del colore base per personaggi ed edifici (vedi Elevation & Depth).
- **Border:** nessuno.
- **Internal Padding:** 24 px (20 per le card strette, 18 per gli edifici, la cui illustrazione esce dal bordo in basso).

### Inputs / Fields
- **Style:** la firma è un riquadro bianco di 120 px con raggio 16 e una riga di base; si firma col dito oppure si scrive il nome in Instrument Serif corsivo da 30 px, nel blu della firma.
- **Focus:** anello d'inchiostro di 2,5 px attorno al riquadro.
- **Error / Disabled:** se manca la firma, anello di filo rosso per 1,4 s e un messaggio per lo screen reader.
- **Scelte nel testo:** le parole sostituibili del patto sono evidenziate in germoglio, con raggio 6 e una sottolineatura germoglio più scura; si toccano su 44 px.

### Navigation
- **Style:** barra nera alta 72 px con il logo (casetta su quadrato germoglio) e due pillole: «Ferma le animazioni» (trasparente, solo icona sotto i 560 px) e «Da decidere» (bianca).
- **Nell'app:** la home è il borgo, un hub world diegetico: si tocca un edificio per entrare nel suo argomento. Barra in basso con quattro schede (Borgo, Lezioni, Patto, Profilo); la scheda Lezioni è la stessa mappa in forma di lista, accessibile.

### Il patto (signature)
Il foglio caldo con trama a puntini, cinque articoli numerati in codice, il titolo «Il *Patto*», la firma e la ceralacca della socia che cade con la molla. È l'unico oggetto di carta dell'app.

### Il borgo (signature)
Un'isola isometrica che cresce: ogni edificio ha quattro stati (progetto a terra con picchetto, cantiere con impalcatura, costruito, fiorito). Selezionare un edificio accende la sua casella con un contorno d'inchiostro e lo solleva di 5 px; la didascalia sotto dice nome, argomento e stato.

## Do's and Don'ts

### Do:
- **Do** tenere la struttura in nero (#000000) e bianco (#FFFFFF) e mettere il colore solo in personaggi, borgo e premi.
- **Do** scrivere i titoli in peso regular con una sola parola in Instrument Serif corsivo.
- **Do** usare card piene senza bordi, con raggi da 28 px in su e l'alone del loro colore.
- **Do** usare il germoglio come superficie intera nei momenti premio (patto firmato, edificio finito).
- **Do** mostrare il progresso nel mondo (edifici, abitanti, numeri grandi in serif) invece che con barre e percentuali.
- **Do** usare la molla (cubic-bezier(.34, 1.56, .64, 1), 480 ms) solo per premi, personaggi e ceralacca; per tutto il resto la curva standard (cubic-bezier(.2, .8, .2, 1), 240 ms).
- **Do** dare a ogni animazione continua un modo per fermarsi, e con «riduci movimento» togliere gli spostamenti ma tenere le dissolvenze che confermano un'azione.
- **Do** rendere ogni elemento toccabile su almeno 44 px.

### Don't:
- **Don't** usare il germoglio come colore di un bottone.
- **Don't** mettere bordi da 1 px su card o contenitori.
- **Don't** usare Fragment Mono per etichette o didascalie, né il maiuscolo su testi lunghi.
- **Don't** usare il grassetto per fare gerarchia nei titoli.
- **Don't** portare la carta calda fuori dal patto, né il filo rosso fuori dal patto e dal filo.
- **Don't** disegnare illustrazioni piatte: personaggi ed edifici hanno sempre luce da sinistra e ombre morbide.
- **Don't** usare lucchetti, punizioni, timer o scarsità finta: niente serie che si azzera, niente abitanti che se ne vanno.
