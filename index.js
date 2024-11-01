import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

// Fill in all the necessary information to connect to the desired Postgres database
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todolist",
  password: "dataBASE",
  port: 5432,
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
