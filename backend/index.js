
const cors = require('cors');
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const db = require("./db");
const axios = require("axios");
const {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  findNextAvailableSlot
} = require("./eventService");

app.use(bodyParser.json());
app.use(cors());

function formatForMySQL(dateStr) {
  const d = new Date(dateStr);
  // Pad single digits with 0
  const pad = (n) => (n < 10 ? "0" + n : n);
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

function hasOverlap(newEvent, existingEvents) {
  const newStart = new Date(newEvent.start_time).getTime();
  const newEnd = new Date(newEvent.end_time).getTime();

  return existingEvents.some((e) => {
    const start = new Date(e.start_time).getTime();
    const end = new Date(e.end_time).getTime();
    return newStart < end && newEnd > start;
  });
}

// Creating an API Endpoint to accept a prompt
app.post("/prompt", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  // Fetch existing events from the database (Context)
  let rows = [];
  try {
    // Fetch events from the database
    const dbRows = await getAllEvents();
    rows = dbRows;
    // console.log("Existing events:", rows);
  } catch (err) {
    console.log("Error fetching events:", err);
  }

  const context = rows.map((e) => ({
    ...e,
    start_time: formatForMySQL(e.start_time),
    end_time: formatForMySQL(e.end_time),
  }));

  //Prompt processing by Natural Language Processing (NLP) model
  try {
    const nlpResponse = await axios.post(
      "http://127.0.0.1:11434/api/generate",
      {
        model: "llama3.1:latest",
        prompt: `
You are an AI assistant that schedules events. Given the context of existing events and the prompt, you need to follow these rules:
1. Parse the user's request and extract the following fields:
   - title
   - description (default to 'Empty' if not provided)
   - start_time and end_time (format 'YYYY-MM-DD HH:MM:SS')
   - location (default to NULL if not provided)
   - all_day (default to FALSE if not provided)

- DO NOT output any intermediate thoughts, parsing steps, or explanations.

- Example output:
{
  "title": "Swimming Lesson",
  "description": "Empty",
  "start_time": "2025-09-10 08:00:00",
  "end_time": "2025-09-10 16:00:00",
  "location": null,
  "all_day": false
}


Context:${context}
Prompt: ${prompt}
      `,
        max_tokens: 3000,
        stream: false,
      }
    );

    console.log("Raw Ollama response:", nlpResponse.data.response);

    const parts = nlpResponse.data.response.replaceAll("\n", " ");

    console.log(JSON.parse(parts));

    //After getting JSON, need to compare with existing events
    parsedEvent = JSON.parse(parts);

    const isClash = hasOverlap(parsedEvent, context);

    console.log("isClash", isClash);

    let nextAvailableSlot = null;
    //If there isClash, find next available slot
    if(isClash){
      nextAvailableSlot = await findNextAvailableSlot(parsedEvent);
      console.log("Next available slot:", nextAvailableSlot);
    }

    //If no clash, add into the database
    if (!isClash) {
      try {
        const result = await createEvent(parsedEvent);
        console.log("Event created:", result);
      } catch (err) {
        console.error("Error creating event:", err);
      }
    }

    //Ask NLP model to generate human-readable message
    let humanMessage;

    const messageResponse = await axios.post(
      "http://127.0.0.1:11434/api/generate",
      {
        model: "llama3.1:latest",
        prompt: `
You are an AI assistant generating a human-readable scheduling message.
Given:
- Event: ${JSON.stringify(parsedEvent)}
- Clash: ${isClash}
- NextAvailableSlot: ${JSON.stringify(nextAvailableSlot)}
Rules:
- If clash is true: generate a friendly message telling the user there is a conflict and recommend the next available slot if provided. Do not include any further questions.
- If clash is false: generate a friendly confirmation message.
- Only output the message text, no JSON, no reasoning.
        `,
        max_tokens: 200,
        stream: false,
      }
    );

    humanMessage = messageResponse.data.response.replaceAll("\n", " ");

    console.log(humanMessage); // Return this message

    // console.log(jsonData); // Pass this into SQL generation
    res.json({ response: humanMessage });
    // const result = await createEvent(jsonData);
    // console.log("Event created:", result);


  } catch (error) {
    console.error("Error processing prompt:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//CRUD ROUTES Working

//CREATE
app.post("/events", async (req, res) => {
  try {
    const event = await createEvent(req.body);
    res.status(201).json(event);
  } catch (err) {
    if (err.message === "Missing required fields") {
      return res.status(400).json({ error: err.message });
    }
    console.error("Error inserting event:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Read All
app.get("/events", async (req, res) => {
  const events = await getAllEvents();
  res.json(events);
});

//Read One
app.get("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await getEventById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(event);
  } catch (err) {
    console.log("Error fetching event:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//UPDATE
app.put("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateEvent(id, req.body);
    res.status(200).json(result);
  } catch (err) {
    console.log("Error updating event:", err);
    res.status(err.status || 500).json({ error: err.message });
  }
});

//DELETE
app.delete("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteEvent(id);
    res.status(200).json(result);
  } catch (err) {
    console.log("Error deleting event:", err);
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
