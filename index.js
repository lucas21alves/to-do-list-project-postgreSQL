import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
const port = 3000;

// Login with the postgreSQL database
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Connecting our PG Database
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {

  try {
    let items = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = items.rows;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
    }
  
  catch(err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {

  try {
    const item = req.body.newItem;
    await db.query("INSERT INTO items (title) values ($1)",
      [item]
    );

    res.redirect("/");
  }

  catch {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {

  try {
    let updateItemId = req.body.updatedItemId;
    let updatedItemTitle = req.body.updatedItemTitle;

    db.query("UPDATE items SET title = $1 WHERE id = $2",
      [updatedItemTitle, updateItemId]
    );

    res.redirect('/');
  }

  catch {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {

  try {
    db.query("DELETE FROM items WHERE id = $1",
      [req.body.deleteItemId]
    );

    res.redirect('/');
  }

  catch {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
