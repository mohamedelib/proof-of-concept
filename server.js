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

app.get("/", async function (request, response) {
  // Render index.liquid uit de Views map en geef de opgehaalde data mee, in een variabele genaamd person
  response.redirect(303, "/login");
});

// GET routes:

app.get("/login", async function (request, response) {
  // Render index.liquid uit de Views map en geef de opgehaalde data mee, in een variabele genaamd person
  response.render("login.liquid");
});

app.get("/gebruikers", async function (request, response) {
  const zoek = request.query.zoek?.toLowerCase() || ""; // pakt de zoekterm uit URL (? zorgt ervoor dat hij niet crasht)

  const gebruikersResponse = await fetch(
    "https://fdnd-agency.directus.app/items/tweakers_users?sort=-number_of_posts", // gebruikers ophalen
  );

  const gebruikersData = await gebruikersResponse.json();

  const users = zoek
    ? gebruikersData.data.filter((u) => u.username.toLowerCase().includes(zoek))
    : gebruikersData.data; // als er een zoekterm is filtert hij op naam, anders geeft hij alle gebruikers terug

  response.render("gebruikers.liquid", {
    users,
    zoek,
    activePage: "gebruikers",
  });
});

app.get("/topics", async function (request, response) {
  const name = request.query.name;

  const gebruikersResponse = await fetch(
    "https://fdnd-agency.directus.app/items/tweakers_users?sort=-number_of_posts&limit=5",
  );
  const gebruikersData = await gebruikersResponse.json();

  const categorieen = [7, 4, 127, 100, 32, 9, 41]; // Lijst met categorie IDS om de juiste RSS feed op te halen

  const teksten = await Promise.all(
    // Haalt alle RSS feeds tegelijk op. Promise.all wacht totdat alle fetches klaar zijn voor hij verder gaat.
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
    // Loopt door elke RSS feed heen en zet de XML om naar een bruikbaar object.
    const { feed } = parseFeed(xml);
    // console.log(feed.items[0]);

    let totaalReacties = 0;
    for (const item of feed.items) {
      const replies = Number(
        item.description.substring(9, item.description.indexOf("\n")), // substring(9) slaat de eerste 9 tekens over, indexOf("\n")
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

  response.render("topics.liquid", {
    items: items.slice(0, 40),
    categorieen: categorieStats.slice(0, 5),
    users: gebruikersData.data,
    activePage: "topics",
  });
});

app.get("/dashboard", async function (request, response) {
  const name = request.query.name;

  const gebruikersResponse = await fetch(
    "https://fdnd-agency.directus.app/items/tweakers_users?sort=-number_of_posts&limit=5",
  );
  const gebruikersData = await gebruikersResponse.json();

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
    // console.log(feed.items[0]);

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

  response.render("dashboard.liquid", {
    items: items.slice(0, 5),
    categorieen: categorieStats.slice(0, 5),
    users: gebruikersData.data,
    name: name ? name : "",
    activePage: "dashboard",
  });
});

// POST routes: /
app.post("/", async function (request, response) {
  response.redirect(303, "/");
});

app.post("/login", async function (request, response) {
  const name = request.body.name;

  response.redirect(303, "/dashboard?name=" + name);
});

// Start de server
app.set("port", process.env.PORT || 8000);
app.listen(app.get("port"), function () {
  console.log(`Application started on http://localhost:${app.get("port")}`);
});
