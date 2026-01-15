const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", 
  database: "chatbot_db",
  port: 3306
});

db.connect(err => {
  if (err) throw err;
  console.log("Ansluten till MySQL");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/chat", (req, res) => {
  const userInput = req.body.message.toLowerCase();

  const sql = "SELECT output FROM chatbot WHERE input = ?";
  db.query(sql, [userInput], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      res.send(`
        <p><strong>Du:</strong> ${userInput}</p>
        <p><strong>Chatbot:</strong> ${result[0].output}</p>
        <a href="/">Skicka nytt meddelande</a>
      `);
    } else {
      db.query(
        "SELECT output FROM chatbot WHERE input = 'default'",
        (err, def) => {
          res.send(`
            <p><strong>Du:</strong> ${userInput}</p>
            <p><strong>Chatbot:</strong> ${def[0].output}</p>
            <a href="/">Skicka nytt meddelande</a>
          `);
        }
      );
    }
  });
});

app.listen(3000, () => {
  console.log("Servern körs på http://localhost:3000");
});