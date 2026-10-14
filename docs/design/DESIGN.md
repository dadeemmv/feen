---
name: Feen
description: App di educazione finanziaria per le superiori. Premium e giocosa, con la tavolozza Harmony e un borgo che cresce come la FIFA City di FIFA 12 su Wii.
colors:
  ink: "#111827"
  ink-2: "#374151"
  muted: "#646B78"
  faint: "#9CA3AF"
  line: "rgba(17,24,39,.08)"
  fill: "rgba(17,24,39,.055)"
  paper: "#FFFFFF"
  surface: "#F8F9FB"
  disabled: "#ECEEF2"
  indigo: "#2B64F4"
  indigo-pressed: "#1752E8"
  indigo-tint: "#E7EEFD"
  indigo-text: "#184ED8"
  indigo-deep: "#1847BF"
  indigo-night: "#1C54E3"
  sun: "#FFCC4D"
  sun-tint: "#FFF6DF"
  sun-deep: "#855D00"
  green: "#22C55E"
  green-tint: "#E0F7E8"
  green-deep: "#166534"
  rose: "#FF6B8B"
  rose-tint: "#FFEAEF"
  rose-deep: "#BE123C"
  cyan: "#00D1FF"
  cyan-tint: "#DBF9FF"
  cyan-deep: "#00708A"
  lilac: "#B794F6"
  lilac-tint: "#F5F0FE"
  lilac-deep: "#6D28D9"
  coral: "#FF5B3A"
  coral-tint: "#FFE0D8"
  coral-deep: "#8A2310"
  leaf: "#6CC04A"
  leaf-tint: "#E3F4CC"
  wheat-tint: "#FFEBB8"
  stone: "#9C9384"
  stone-tint: "#ECE9E3"
  wood: "#C49460"
  wood-tint: "#F3E6D3"
  contract: "#F6F1E6"
  thread: "#D42B26"
  sign: "#1847BF"
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
    backgroundColor: "{colors.indigo}"
    textColor: "{colors.paper}"
    typography: "{typography.body-card}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "52px"
  button-on-indigo:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.indigo}"
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
    backgroundColor: "{colors.indigo-tint}"
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
  card-on-indigo:
    backgroundColor: "{colors.indigo-night}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "24px"
  option-answer:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "18px"
    padding: "10px 14px"
    height: "48px"
  option-answer-selected:
    backgroundColor: "{colors.paper}"
    borderColor: "{colors.indigo}"
    rounded: "18px"
  option-answer-correct:
    backgroundColor: "{colors.green-tint}"
    borderColor: "{colors.green}"
    rounded: "18px"
  option-answer-wrong:
    backgroundColor: "{colors.rose-tint}"
    borderColor: "{colors.rose}"
    rounded: "18px"
  toast-reward:
    backgroundColor: "{colors.indigo}"
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
    backgroundColor: "{colors.indigo-tint}"
    textColor: "{colors.ink}"
    rounded: "6px"
    padding: "0 6px"
  contract:
    backgroundColor: "{colors.contract}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "32px"
---

# Design System: Feen

## Overview

**Creative North Star: "Il plastico in galleria", a colori Harmony**

Una galleria bianca e luminosa, con il blu come firma del marchio, e al centro un plastico colorato fatto a mano: il borgo, i quattro animali, il patto con la ceralacca. Dal 12/10/2026 l'interfaccia segue la tavolozza Harmony: bianco come tela, blu per tutto quello che si tocca, colori vivaci solo per premi e stati (giusto, sbagliato, mattoni, traguardi, informazioni). Titoli grandi in peso regular, superfici piene senza bordi, pillole blu: questa è la galleria. Personaggi con volume, edifici isometrici con la luce da sinistra, la carta calda del patto: questo è il plastico.

Il tono è **sicuro, caldo e spiritoso**. Sicuro nei titoli enormi e nelle pillole che dicono cosa fanno. Caldo nei personaggi, nella socia che parla e nella carta del patto. Spiritoso in una parola in corsivo per titolo e in un premio che rimbalza. La densità è bassa: molto bianco, una cosa per volta, numeri grandi al posto delle barre. Il progresso si vede nel mondo (un edificio a metà, un abitante in più), non in percentuali.

Rifiuti confermati: l'aspetto da app per bambini (illustrazioni piatte, colori ovunque senza un perché) e l'aspetto da dashboard (bordi da 1 px, griglie di barre, etichette tecniche dappertutto).

**Key Characteristics:**
- Tela bianca, blu come unico colore d'azione; gli altri cinque colori Harmony solo con un significato.
- Titoli in Instrument Sans regular, con una sola parola in Instrument Serif corsivo.
- Card piene, senza bordi, raggi da 28 a 50 px, con l'alone del loro colore sotto.
- Volume (luce, ombre morbide, riflessi) solo in borgo, personaggi e oggetti.
- Movimento rapido e pulito per navigare, la molla solo per premi, personaggi e ceralacca.

## Colors

La tavolozza Harmony: bianco come tela, blu come firma del marchio, colori vivaci per premi e stati, grigi freddi. Ogni colore ha tre toni: la base, la tinta per gli sfondi, il profondo per il testo sopra la tinta (almeno 4,5:1).

### Primary
- **Blu** (token `indigo`, #2B64F4; fino al 12/10/2026 era indaco #6C5CE7): bottoni principali, scheda attiva in basso, selezione, barre di avanzamento, anello del focus, parole da toccare nel patto, «Prossimo cantiere» sulla mappa. È il colore che agisce. Per il testo piccolo si usa il blu testo (indigo-text), che regge 4,5:1 anche sulla tinta.
- **Superfici blu**: la copertina di benvenuto, «Il tuo personaggio», «Lezione fatta.», i toast. Sopra il blu il testo è sempre bianco (5:1), il bottone diventa bianco con l'etichetta blu e le card interne sono di un blu più profondo (indigo-night).
- **Bianco** (paper): la tela dell'app.

### I colori con un significato
- **Verde** (green): giusto, risultati positivi, abitanti.
- **Rosa** (rose): sbagliato, perdite. Cerchi e bordi nel rosa vivo; il testo e il bottone «Chiudi» nel rosa profondo, che regge l'etichetta bianca.
- **Giallo sole** (sun): mattoni e giorni del patto (il «Streak / XP» di Harmony), il cantiere di oggi e i lotti liberi sulla mappa, la parola in corsivo sul blu (solo testo grande, 3,2:1).
- **Ciano** (cyan): informazioni e spiegazioni, come il riquadro «Definizione» nelle lezioni.
- **Lilla** (lilac): i traguardi. È la superficie dei momenti premio («Prima pietra posata», «Mercato costruito.»), il riempimento del tieni premuto, «Al primo colpo» ed «Edifici costruiti». Sul lilla il testo è sempre in inchiostro: il grigio scende sotto 4,5:1.

### Neutral
- **Inchiostro** (ink, #111827): testo.
- **Grigio scuro** (ink-2): testo secondario e corpo delle card.
- **Grigio etichetta** (muted): etichette e didascalie su bianco e su superficie. Sulle tinte si usa il tono profondo della tinta.
- **Superficie** (surface, #F8F9FB, lo «sfondo» di Harmony): card piene su bianco; su superficie le card tornano bianche.
- **Carta del patto** (contract): l'unico materiale caldo dell'app, con una trama a puntini da 14 px.
- **Linea e velo** (line, fill): divisori tratteggiati del patto e fondo delle pillole secondarie e delle chip.

### Personaggi ed edifici
Gli animali prendono i colori della tavolozza, tranne la Volpe, che resta corallo: una volpe rosa non sembra una volpe, e il rosa vuol dire errore.
- **Corallo** (coral): Volpe Esploratrice, Bottega, Faro.
- **Blu** (indigo): Castoro Ingegnere, Municipio, Torre.
- **Ciano** (cyan): Lontra Conviviale, Pozzo.
- **Giallo sole** (sun): Scoiattolo Custode, Mercato.

Gli edifici che non hanno un personaggio prendono il colore del loro materiale: **Verde** per il Banco (il tetto), **Foglia** per il Frutteto, **Grano** per il Granaio, **Pietra** per le Mura, **Legno** per il Ponte. Erba, acqua, legno e pietra del borgo restano naturali.

### Stati
- **Giusto** (green-tint, bordo green) e **sbagliato** (rose-tint, bordo rose): le risposte delle lezioni. La risposta scelta prima della verifica ha il bordo blu.
- **Disattivato**: bottoni principali in tinta blu con l'etichetta grigia, anche il tieni premuto prima della firma.
- **Inchiostro della firma** (sign): il blu profondo, per la firma disegnata, la firma scritta e il cursore del campo.

### Named Rules
**The Blue Rule.** Il blu è l'unico colore d'azione. Se si tocca ed è importante, è blu; se è blu, si tocca o mostra dove sei.

**The Meaning Rule.** Verde, rosa, giallo, ciano e lilla entrano solo con il loro significato (giusto, sbagliato, mattoni, informazione, traguardo). Mai per decorare.

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

Una colonna centrale larga al massimo 1160 px, con margini di 24 px (16 sotto i 700 px). Le sezioni respirano: 120 px sopra e sotto, 80 sul telefono. Si alternano sezioni bianche, grigio superficie e blu; la superficie lilla a tutto schermo è riservata ai momenti premio.

La spaziatura ha base 4 (4, 8, 12, 16, 24, 32, 48, 64). Le card si dispongono in griglie con 16 px di spazio. Punti di rottura dettati dal contenuto: 1080 px (personaggi e patto passano a una colonna), 900 px (griglie a due colonne, carosello che scorre), 700 px (una colonna, borgo che si scorre), 560 px (il bottone del movimento diventa solo icona), 420 px (le griglie di card brevi passano a una colonna).

Sul telefono il borgo non diventa una miniatura: resta largo 620 px, si scorre di lato e parte centrato sul cantiere di oggi. Le file di schermate e il carosello dei personaggi scorrono di lato con l'aggancio al centro.

## Elevation & Depth

L'interfaccia è piatta: niente bordi, niente ombre di elevazione. La profondità delle card viene dall'**alone del loro colore**, un'ombra lunga e morbida della stessa tinta che si apre sotto la card come un riflesso sul pavimento della galleria. Il volume vero vive solo nel mondo: personaggi e borgo hanno la luce da sinistra, ombre morbide a terra verso destra, sfumature sulle facciate (più chiare in alto, più scure alla base) e riflessi su teste e alberi. Gli oggetti fisici, cioè il foglio del patto e i telefoni disegnati, hanno un'ombra calda e diffusa.

### Shadow Vocabulary
- **Alone della card** (`box-shadow: 0 70px 70px -70px <colore base>`): sotto le card dei personaggi e degli edifici.
- **Alone del carosello** (`box-shadow: 0 90px 90px -90px <colore base>`): sotto le card dei personaggi in apertura, sul blu.
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
- **Primary:** blu con testo bianco su fondo chiaro (anche sul lilla dei momenti premio).
- **On indigo:** bianco con testo blu sulle superfici blu.
- **Secondary:** velo grigio. **Ghost:** trasparente.
- **Glass:** pillola semitrasparente alta 34 px con sfocatura dello sfondo, solo sopra le card degli edifici («Vedi le lezioni ↗»).
- **Hover / Focus / Active:** alla pressione si stringe al 97% in 160 ms; il focus è un anello blu di 2,5 px staccato di 3 px, bianco sul blu.
- **Tieni premuto:** il bottone blu si riempie di lilla da sinistra in 1,1 s mentre lo tieni (anche con spazio o Invio); prima della firma è disattivato (tinta blu, etichetta grigia) e, se lo premi, il riquadro della firma si accende di filo rosso.

### Chips
- **Style:** pillola alta 28 px, velo grigio, testo etichetta. Sulle card dei personaggi il fondo è bianco al 75% e il testo nel tono profondo del personaggio.
- **State:** solo informative; non sono filtri.

### Cards / Containers
- **Corner Style:** 28 px (36 per i personaggi, 34 per gli edifici).
- **Background:** superficie su bianco, bianco su superficie, blu profondo sul blu; tinta del personaggio o del materiale per personaggi ed edifici; tinta ciano per le definizioni.
- **Shadow Strategy:** nessuna ombra; alone del colore base per personaggi ed edifici (vedi Elevation & Depth).
- **Border:** nessuno.
- **Internal Padding:** 24 px (20 per le card strette, 18 per gli edifici, la cui illustrazione esce dal bordo in basso).

### Inputs / Fields
- **Style:** la firma è un riquadro bianco di 120 px con raggio 16 e una riga di base; si firma col dito oppure si scrive il nome in Instrument Serif corsivo da 30 px, nel blu della firma.
- **Focus:** anello d'inchiostro di 2,5 px attorno al riquadro.
- **Error / Disabled:** se manca la firma, anello di filo rosso per 1,4 s e un messaggio per lo screen reader.
- **Scelte nel testo:** le parole sostituibili del patto sono evidenziate in tinta blu, con raggio 6 e una sottolineatura blu; si toccano su 44 px. La nota sotto il patto dice «Le parole sottolineate si toccano e cambiano», senza nominare il colore.

### Navigation
- **Marchio:** il logotipo «Feen» è in Instrument Sans SemiBold; l'icona è «fe» bianco su quadrato blu con un punto giallo sole in alto a destra (provvisoria, ricavata dal font dell'app).
- **Nella board di concept:** barra nera alta 72 px con il logo e due pillole (versione v0.1, ancora in bianco e nero).
- **Nell'app:** la home è il borgo, un hub world diegetico: si tocca un edificio per entrare nel suo argomento. Barra in basso con quattro schede (Borgo, Lezioni, Patto, Profilo); la scheda Lezioni è la stessa mappa in forma di lista, accessibile.

### Il patto (signature)
Il foglio caldo con trama a puntini, cinque articoli numerati in codice, il titolo «Il *Patto*», la firma e la ceralacca della socia che cade con la molla. È l'unico oggetto di carta dell'app.

### Il borgo (signature)
Un'isola isometrica che cresce: ogni edificio ha quattro stati (progetto a terra con picchetto, cantiere con impalcatura, costruito, fiorito). Selezionare un edificio accende la sua casella con un contorno d'inchiostro e lo solleva di 5 px; la didascalia sotto dice nome, argomento e stato.

**Il ripasso (dal 14/10/2026).** Una settimana dopo che un edificio è finito, il suo abitante (la fruttivendola al Mercato, il fornaio al Granaio, la contadina al Pozzo, il pescatore al Faro, la guardia alle Mura, il giardiniere al Frutteto, la vedetta alla Torre) aspetta accanto all'edificio. Sopra il tetto c'è un fumetto bianco con un «?» in serif corsivo che ondeggia piano; con «riduci movimento» sta fermo. Nella home una riga sopra la socia dice «Il pescatore ti aspetta al Faro.» con il bottone secondario «Aiutalo». Il ripasso è una sola domanda, senza tempo né vite, in una card grigia con le parole dell'abitante tra caporali.
- **Risposta giusta:** l'edificio fiorisce. Schermata lilla con coriandoli, «Faro *fiorito.*», il grazie dell'abitante, il perché detto dalla socia e 10 mattoni in regalo. Sulla mappa compare un'aiuola di fiori lungo i due lati davanti alla casella.
- **Risposta sbagliata:** non si perde niente. Quella scelta diventa rosa e quella giusta verde. La socia spiega, e l'abitante ripassa dopo 3 giorni con un'altra domanda.

## Do's and Don'ts

### Do:
- **Do** tenere la tela bianca, il blu per le azioni e gli altri colori Harmony solo con il loro significato.
- **Do** scrivere i titoli in peso regular con una sola parola in Instrument Serif corsivo.
- **Do** usare card piene senza bordi, con raggi da 28 px in su e l'alone del loro colore.
- **Do** usare il lilla come superficie intera nei momenti premio (prima pietra, edificio finito, edificio fiorito), con il testo in inchiostro.
- **Do** mostrare il progresso nel mondo (edifici, abitanti, numeri grandi in serif) invece che con barre e percentuali.
- **Do** usare la molla (cubic-bezier(.34, 1.56, .64, 1), 480 ms) solo per premi, personaggi e ceralacca; per tutto il resto la curva standard (cubic-bezier(.2, .8, .2, 1), 240 ms).
- **Do** dare a ogni animazione continua un modo per fermarsi, e con «riduci movimento» togliere gli spostamenti ma tenere le dissolvenze che confermano un'azione.
- **Do** rendere ogni elemento toccabile su almeno 44 px.

### Don't:
- **Don't** usare verde, rosa, giallo, ciano o lilla per un bottone o per decorare: i bottoni sono blu.
- **Don't** mettere bordi da 1 px su card o contenitori.
- **Don't** usare Fragment Mono per etichette o didascalie, né il maiuscolo su testi lunghi.
- **Don't** usare il grassetto per fare gerarchia nei titoli.
- **Don't** portare la carta calda fuori dal patto, né il filo rosso fuori dal patto e dal filo.
- **Don't** disegnare illustrazioni piatte: personaggi ed edifici hanno sempre luce da sinistra e ombre morbide.
- **Don't** usare lucchetti, punizioni, timer o scarsità finta: niente serie che si azzera, niente abitanti che se ne vanno.
