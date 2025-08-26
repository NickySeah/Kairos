const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const db = require('./db');

app.use(bodyParser.json());

//CRUD ROUTES

//CREATE
app.post("/events", async (req, res) => {
  const { user_id, title, description, start_time, end_time, location, all_day } = req.body;
  const dbLocation = location === undefined ? null : location;
  const [result] = await db.query("INSERT INTO events (user_id, title, description, start_time, end_time, location, all_day) VALUES (?, ?, ?, ?, ?, ?, ?)", [user_id, title, description, start_time, end_time, dbLocation, all_day]);
  res.status(201).json({ id: result.insertId, user_id, title, description, start_time, end_time, location, all_day });
});

//Read All
app.get("/events", async (req, res) => {
  // Fetch events from the database
  const [rows] = await db.query("SELECT * FROM events");
  res.json(rows);
});

//Read One
app.get("/events/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const [rows] = await db.query("SELECT * FROM events WHERE user_id = ?", [user_id]);
  res.json(rows[0]);
});

//UPDATE


//DELETE


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});