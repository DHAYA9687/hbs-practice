import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import handlebars from "express-handlebars";
import mysql from "mysql";
const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//static files
app.use(express.static("public"));
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "users",
});
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to database");
});

//view engine
const hbs = handlebars.create({ extname: ".hbs" });
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

//routes

app.get("/", (req, res) => {
  const query = "SELECT * FROM student";
  db.query(query, (err, result) => {
    if (err) {
      throw err;
    }
    res.render("home", { students: result });
    console.log(result);
  });
});
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM student WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err.stack);
      res.status(500).send("Error deleting data");
      return;
    }

    res.sendStatus(200);
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
