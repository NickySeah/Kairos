const db = require("./db");

function validateEventInput({ title, start_time, end_time }) {
  if (!title || !start_time || !end_time) {
    const err = new Error(
      "Missing one of the required fields: title, start_time, end_time"
    );
    err.status = 400;
    throw err;
  }
}

async function getAllEvents() {
  try {
    // Fetch events from the database
    const [rows] = await db.query("SELECT * FROM events");
    return rows;
  } catch (err) {
    console.log("Error fetching events:", err);
    throw new Error("Internal Server Error");
  }
}

async function getEventById(id) {
  try {
    const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [id]);
    return rows[0] || null;
  } catch (err) {
    console.log("Error fetching event:", err);
    throw new Error("Internal Server Error");
  }
}

async function createEvent({
  title,
  description,
  start_time,
  end_time,
  location,
  all_day,
}) {
  validateEventInput({ title, start_time, end_time });

  const dbLocation = location === undefined ? null : location;

  const [result] = await db.query(
    "INSERT INTO events (title, description, start_time, end_time, location, all_day) VALUES (?, ?, ?, ?, ?, ?)",
    [title, description, start_time, end_time, dbLocation, all_day]
  );

  return {
    id: result.insertId,
    title,
    description,
    start_time,
    end_time,
    location,
    all_day,
  };
}

async function updateEvent(
  id,
  { title, description, start_time, end_time, location, all_day }
) {
  validateEventInput({ title, start_time, end_time });

  const dbLocation = location === undefined ? null : location;

  const [result] = await db.query(
    "UPDATE events SET title = ?, description = ?, start_time = ?, end_time = ?, location = ?, all_day = ? WHERE id = ?",
    [title, description, start_time, end_time, dbLocation, all_day, id]
  );

  if (result.affectedRows === 0) {
    const err = new Error("Event not found");
    err.status = 404;
    throw err;
  }

  return {
    id,
    title,
    description,
    start_time,
    end_time,
    location,
    all_day,
  };
}

async function deleteEvent(id) {
  try {
    const [result] = await db.query("DELETE FROM events WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      const error = new Error("Event not found");
      error.status = 404; // add custom status code
      throw error;
    }
    return { message: "Event deleted successfully", id };
  } catch (error) {
    console.error("Error deleting event:", error);
    if (error.status) throw error;
    const err = new Error("Internal Server Error");
    err.status = 500;
    throw err;
  }
}

async function findNextAvailableSlot({
  title,
  description,
  start_time,
  end_time,
  location,
  all_day,
}) {
  // Calculate duration in milliseconds between requested start
  const duration = new Date(end_time) - new Date(start_time);

  const bufferTime = 60 * 60 * 1000;

  const totalRequiredTime = duration + bufferTime * 2;

  // Get all events from database
  const [rows] = await db.query(`
    SELECT id, start_time, end_time 
    FROM events 
    ORDER BY start_time ASC
  `);

  // Convert input times to Date objects
  const requestedStart = new Date(start_time);
  const requestedEnd = new Date(end_time);

  // Process all events with proper timezone handling
  const events = rows.map((r) => ({
    start: new Date(r.start_time),
    end: new Date(r.end_time),
    id: r.id,
  }));

  // Sort events chronologically
  events.sort((a, b) => a.start - b.start);

  // If no events, schedule at requested time
  if (events.length === 0) {
    return {
      suggested_start_time: formatDateSG(requestedStart),
      suggested_end_time: formatDateSG(
        new Date(requestedStart.getTime() + duration)
      ),
    };
  }

  // Check if requested slot conflicts with any existing events
  const hasConflict = events.some((event) => {
    const bufferStart = new Date(event.start.getTime() - bufferTime);
    const bufferEnd = new Date(event.end.getTime() + bufferTime);
    return (
      (requestedStart >= bufferStart && requestedStart < bufferEnd) ||
      (requestedEnd > bufferStart && requestedEnd <= bufferEnd) ||
      (requestedStart <= bufferStart && requestedEnd >= bufferEnd)
    );
  });

  // If no conflict, use the requested time
  if (!hasConflict) {
    return {
      suggested_start_time: formatDateSG(requestedStart),
      suggested_end_time: formatDateSG(requestedEnd),
    };
  }

  // Check before first event
  // const firstEventWithBuffer = new Date(events[0].start.getTime() - bufferTime);

  // if (
  //   firstEventWithBuffer > new Date(Date.now() + bufferTime) &&
  //   firstEventWithBuffer.getTime() - (Date.now() + bufferTime) >= duration
  // ) {
  //   const suggestedStart = new Date(Date.now() + bufferTime);
  //   return {
  //     suggested_start_time: formatDateSG(suggestedStart),
  //     suggested_end_time: formatDateSG(
  //       new Date(suggestedStart.getTime() + duration)
  //     ),
  //   };
  // }

  // Look between events
  for (let i = 0; i < events.length - 1; i++) {
    const currentEndWithBuffer = new Date(events[i].end.getTime() + bufferTime);
    const nextStartWithBuffer = new Date(events[i + 1].start.getTime() - bufferTime);
    const availableTime = nextStartWithBuffer.getTime() - currentEndWithBuffer.getTime();

    if (availableTime >= duration) {
      return {
        suggested_start_time: formatDateSG(currentEndWithBuffer),
        suggested_end_time: formatDateSG(
          new Date(currentEndWithBuffer.getTime() + duration)
        ),
      };
    }
  }

  // After last event
  const lastEventEndWithBuffer = new Date(events[events.length - 1].end.getTime() + bufferTime);
  return {
    suggested_start_time: formatDateSG(lastEventEndWithBuffer),
    suggested_end_time: formatDateSG(
      new Date(lastEventEndWithBuffer.getTime() + duration)
    ),
  };
}

// Format date in Singapore timezone (UTC+8) in MySQL format
function formatDateSG(date) {
  // Add the UTC offset for Singapore (+8)
  const options = {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const sgTime = new Intl.DateTimeFormat("en-SG", options).format(date);

  // Convert from DD/MM/YYYY, HH:MM:SS format to YYYY-MM-DD HH:MM:SS
  const parts = sgTime.split(", ");
  const dateParts = parts[0].split("/");

  return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]} ${parts[1]}`;
}

module.exports = {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  findNextAvailableSlot,
}; // ✅ export correctly
