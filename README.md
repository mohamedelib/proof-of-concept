# Tweakers Community Dashboard

<img width="820" height="401" alt="image" src="https://github.com/user-attachments/assets/261bc0ea-6bb6-488b-9d89-bacf10fa91b3" />


Een serverside gerenderde community dashboard voor Tweakers, gebouwd met Node.js, Express en LiquidJS. De data komt live binnen via de Directus API en RSS feeds van Tweakers.

🔗 [Live site](https://proof-of-concept-qs99.onrender.com/login)



## Beschrijving

Het dashboard geeft een overzicht van de Tweakers community: actieve topics, top gebruikers, nieuwe posts, actieve categorieën, recente activiteit en nieuwe leden. Data wordt server-side opgehaald en via Liquid gerenderd.

De drie onderdelen die ik in deze README presenteer zijn:

- **Responsive design**  mobile first grid layout die meeschaalt naar desktop
- **Dark mode** automatische kleuromschakeling via `prefers-color-scheme`
- **Progressive enhancement**  Popover navigatie en formuliervalidatie die werken zonder JavaScript

<!-- Voeg hier een screenshot of GIF van het dashboard toe -->
<!-- ![Dashboard overzicht](./docs/screenshot-dashboard.png) -->

---

## Gebruik

### 1. Responsive design

Het dashboard is gebouwd met de mobile first methode. Op kleine schermen staat alles onder elkaar in één kolom. Op grotere schermen schakelt het grid naar drie kolommen waarbij elke widget zijn eigen `grid-area` krijgt.

Door `grid-template-areas` te gebruiken kan ik de volgorde van widgets op mobiel en desktop los van elkaar bepalen. 



https://github.com/user-attachments/assets/9690e28b-daae-4149-b28c-cdaac53e8399

Mobiel: 

<img width="378" height="786" alt="image" src="https://github.com/user-attachments/assets/1af67ea6-3869-4629-a9be-460caf57581f" />


Desktop:
<img width="1186" height="780" alt="image" src="https://github.com/user-attachments/assets/ced4860a-5326-4920-af09-2ce387cc5df8" />



---

### 2. Dark mode

De site checkt automatisch of de gebruiker dark mode aan heeft staan via `@media (prefers-color-scheme: dark)`. Alle kleuren zijn omschreven als custom properties in `:root`, zodat dark mode werkt door alleen de variabelen te veranderen.

https://github.com/mohamedelib/proof-of-concept/blob/82ca17574d9f60d91a65ddb85da2fb3decb8b88b/public/styles/stylesheet.css#L44-L51

De gebruiker hoeft niets te doen. Heeft die dark mode aan op zijn apparaat, dan past het dashboard zich direct aan. Dit is een enhancement bovenop de gewone light mode de site werkt en ziet er goed uit in beide modus. Alleen de color-contrast in darkmode kunnen wel verbeterd worden.

<img width="1186" height="780" alt="image" src="https://github.com/user-attachments/assets/ced4860a-5326-4920-af09-2ce387cc5df8" />
<img width="1439" height="782" alt="image" src="https://github.com/user-attachments/assets/693dc106-ddf7-451a-98f4-c390bb355056" />




---

### 3. Progressive enhancement

#### Popover navigatie

De hamburger navigatie gebruikt de Popover functie. Dit is een `newly-available` browser functie die werkt zonder JavaScript de browser regelt het openen en sluiten via `popovertarget` attributen in de HTML.

https://github.com/mohamedelib/proof-of-concept/blob/82ca17574d9f60d91a65ddb85da2fb3decb8b88b/public/styles/styles.css#L100-L110

In browsers zonder Popover blijft de navigatie gewoon zichtbaar als een normaal blok de content is altijd bereikbaar.

#### Formulier loading state met JavaScript
 
De loginknop heeft een loading state die actief wordt zodra de gebruiker het formulier verstuurt. De knop wordt uitgeschakeld en de tekst verandert naar `Inloggen...`. Het uitschakelen van de knop voorkomt dubbele submits en geeft de gebruiker directe feedback.
 
https://github.com/mohamedelib/proof-of-concept/blob/82ca17574d9f60d91a65ddb85da2fb3decb8b88b/public/scripts/script.js#L3-L14
 
Heeft de gebruiker JavaScript uitstaan, dan werkt het formulier gewoon, de knop submit normaal zonder loading state. De animatie is de enhanced laag bovenop het HTML formulier.
 

https://github.com/user-attachments/assets/9afe049a-dcba-48ff-ba43-34e037260e3e


---

## Kenmerken

### HTML

- Semantische structuur met `<nav>`, `<main>`, `<section>` en `<table>`
- Hamburger navigatie via de native Popover (`popovertarget`)
- Afbeeldingen met `width` en `height` attributen om layout shift te voorkomen

### CSS

- Custom properties in `:root` voor kleuren, spacing en typografie
- `grid-template-areas` voor layouts
- Dark mode via `@media (prefers-color-scheme: dark)`
- `:user-valid` / `:user-invalid` voor formulierfeedback na interactie
- CSS nesting voor overzichtelijke code
- Animaties via `@keyframes` voor de live-indicator en login hero

### Server (Node.js / Express)


Routes:


<img width="834" height="653" alt="image" src="https://github.com/user-attachments/assets/7685d4a0-e093-403b-97fd-dd01581a96cf" />


### Code conventies

- Commentaar boven nieuwe CSS-blokken: `/* newly-available */` bij properties die nog niet widely available zijn
- Nesting alleen voor meer structuur in code
- Geen inline styles alles via custom properties of classes

---

## Installatie

```
# 1. Clone de repository
git clone https://github.com/mohamedelib/proof-of-concept

# 2. Installeer Node
npm install

# 3. Start de server
npm start
```

De site draait standaard op `http://localhost:8000`.

---

## Bronnen

https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)
https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
https://developer.mozilla.org/en-US/docs/Web/CSS/:user-valid
https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
