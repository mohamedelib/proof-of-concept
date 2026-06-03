// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from "express";

//  Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from "liquidjs";

// Importeer feedsmith om RSS-feeds te kunnen uitlezen
import { parseFeed } from "feedsmith";

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express();

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static("public"));

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine("liquid", engine.express());
app.set("views", "./views");

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({ extended: true }));

// GET routes:
// GET routes:
app.get("/", async function (request, response) {
  const categorieen = [7, 4, 127, 100, 32, 9, 41];

  const teksten = await Promise.all(
    categorieen.map(function (categorie) {
      return fetch(
        "https://gathering.tweakers.net/rss/list_topics/" + categorie,
      ).then(function (res) {
        return res.text();
      });
    }),
  );

  const items = [];
  const categorieStats = [];

  for (const xml of teksten) {
    const { feed } = parseFeed(xml);

    let totaalReacties = 0;
    for (const item of feed.items) {
      const replies = Number(
        item.description.substring(9, item.description.indexOf("\n")),
      );
      items.push({ title: item.title, link: item.link, replies: replies });
      totaalReacties += replies;
    }

    categorieStats.push({
      naam: feed.title, // naam van de categorie
      aantalTopics: feed.items.length,
      totaalReacties: totaalReacties,
    });
  }

  // Sorteer aflopend op aantal reacties en pak de top 5 topics
  items.sort(function (a, b) {
    return b.replies - a.replies;
  });

  // Sorteer categorieën aflopend op totaal aantal reacties
  categorieStats.sort(function (a, b) {
    return b.totaalReacties - a.totaalReacties;
  });

  response.render("index.liquid", {
    items: items.slice(0, 5),
    categorieen: categorieStats.slice(0, 5),
  });
});

// POST routes: /
app.post("/", async function (request, response) {
  response.redirect(303, "/");
});

// Start de server
app.set("port", process.env.PORT || 8000);
app.listen(app.get("port"), function () {
  console.log(`Application started on http://localhost:${app.get("port")}`);
});
