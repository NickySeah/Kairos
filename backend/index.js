const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const db = require("./db");

app.use(bodyParser.json());

//CRUD ROUTES Working but need to do type validation?

//CREATE
app.post("/events", async (req, res) => {
  try {
    const { title, description, start_time, end_time, location, all_day } =
      req.body;
    if (!title || !start_time || !end_time) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const dbLocation = location === undefined ? null : location;
    const [result] = await db.query(
      "INSERT INTO events (title, description, start_time, end_time, location, all_day) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, start_time, end_time, dbLocation, all_day]
    );
    res.status(201).json({
      id: result.insertId,
      title,
      description,
      start_time,
      end_time,
      location,
      all_day,
    });
  } catch (err) {
    console.log("Error inserting event:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Read All
app.get("/events", async (req, res) => {
  try {
    // Fetch events from the database
    const [rows] = await db.query("SELECT * FROM events");
    res.json(rows);
  } catch (err) {
    console.log("Error fetching events:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Read One
app.get("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    console.log("Error fetching event:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//UPDATE
app.put("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, start_time, end_time, location, all_day } =
      req.body;
    if (!title || !start_time || !end_time) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const dbLocation = location === undefined ? null : location;
    const [result] = await db.query(
      "UPDATE events SET title = ?, description = ?, start_time = ?, end_time = ?, location = ?, all_day = ? WHERE id = ?",
      [title, description, start_time, end_time, dbLocation, all_day, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({
      id,
      title,
      description,
      start_time,
      end_time,
      location,
      all_day,
    });
  } catch (err) {
    console.log("Error updating event:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//DELETE
app.delete("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM events WHERE id = ?", [id]);
    console.log(result);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully", id });
  } catch (err) {
    console.log("Error deleting event:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
