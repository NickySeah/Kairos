import {useEffect, useState } from '@lynx-js/react';
import CalendarHeader from './CalendarHeader.js';
import CalendarGrid from './CalendarGrid.js';
import DayModal from './DayModal.js';
import EventModal from './EventModal.js';
// import AIChat from './AIChat.js'; // New AI chat component
import './Calendar.css'; // Add main calendar styles

/**
 * Main Calendar App Component
 * Features:
 * - Top half: Calendar view with events
 * - Bottom half: AI chat interface for calendar interactions
 * - Handles event creation, editing, and AI suggestions
 */
export default function Calendar() {
  // Current month/year being displayed
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Selected date for detailed view
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Selected event for editing
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  
  // Modal mode: create new event or edit existing
  const [eventModalMode, setEventModalMode] = useState<'create' | 'edit'>('create');

  // Raw events array as received from API/backend
  const [rawEvents, setRawEvents] = useState([
    {
      id: 7,
      title: 'TikTok Hackathon',
      description: 'Discuss project updates and team coordination',
      start_time: '2025-09-01T02:00:00.000Z',
      end_time: '2025-09-01T03:00:00.000Z',
      location: 'Conference Room A',
      all_day: null,
      created_at: '2025-08-27T13:06:25.000Z',
      updated_at: '2025-08-27T13:06:25.000Z',
    },
    {
      id: 8,
      title: 'Multi-day Conference',
      description: 'Annual technology conference - 3 day event',
      start_time: '2025-08-29T09:00:00.000Z',
      end_time: '2025-08-31T20:00:00.000Z',
      location: 'Convention Center',
      all_day: null,
      created_at: '2025-08-27T13:06:25.000Z',
      updated_at: '2025-08-27T13:06:25.000Z',
    },
    {
      id: 9,
      title: 'Team Meeting',
      description: 'Weekly sync with development team',
      start_time: '2025-08-30T14:00:00.000Z',
      end_time: '2025-08-30T15:30:00.000Z',
      location: 'Office Building',
      all_day: null,
      created_at: '2025-08-27T13:06:25.000Z',
      updated_at: '2025-08-27T13:06:25.000Z',
    },
    {
      id: 10,
      title: 'Team Meeting 3',
      description: 'Weekly sync with development team',
      start_time: '2025-08-28T14:00:00.000Z',
      end_time: '2025-08-28T15:30:00.000Z',
      location: 'Office Building',
      all_day: null,
      created_at: '2025-08-27T13:06:25.000Z',
      updated_at: '2025-08-27T13:06:25.000Z',
    },
  ]);

    const getEvents = async () => {
      try {
        const json = await fetch(
          "http://localhost:3001/events",
        ).then((res) => res.json());
        setRawEvents(json);
        console.log("Fetched events: ", json);
      } 
      catch (error) {
        console.error(error);
        console.log("Using default events")
      } 
    }

    useEffect(() => {
      getEvents();
    }, [])

  /**
   * Groups events by date, handling multi-day events
   * Each event appears on every date it spans
   */

  const groupEventsByDate = (events: any[]) => {
  const grouped: { [key: string]: any[] } = {};

  events.forEach((event) => {
    const startDate = new Date(event.start_time);
    const endDate = new Date(event.end_time);

    // Create event instances for each date the event spans
    const currentDate = new Date(event.start_time);

    let localStart = startDate.toDateString();
    let localCurrent  = currentDate.toDateString();
    let localEnd = endDate.toDateString();

    while (new Date(localCurrent) <= new Date(localEnd)) {

      if (!grouped[localCurrent]) {
        grouped[localCurrent] = [];
      }

      // Default bounds for this day
      const dayStart = new Date(localCurrent);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(localCurrent);
      dayEnd.setHours(23, 59, 59, 999);

      // Clamp to real event range
      const splitStart =
        localCurrent === localStart
          ? startDate.toString()
          : dayStart;
      const splitEnd =
        localCurrent === localEnd
          ? endDate.toString()
          : dayEnd;

      // Add event with adjusted start/end for this date
      const eventForDate = {
        ...event,
        start_time: splitStart,
        end_time: splitEnd,
        //displayStartTime: formatTimeForDate(event, currentDate),
        //isMultiDay: startDate.toDateString() !== endDate.toDateString(),
        //isFirstDay: currentDate.toDateString() === startDate.toDateString(),
        //isLastDay: currentDate.toDateString() === endDate.toDateString(),
      };
      if (event.title == "Multi-day Conference"){
        console.log(localCurrent, localEnd, localStart);
        console.log("Multi day event split", splitStart, splitEnd);
        console.log("Original", event.start_time, event.end_time);
      }
      //console.log(splitStart, splitEnd);
      //console.log(eventForDate.start_time, eventForDate.end_time);
      grouped[localCurrent].push(eventForDate);

      // Move to next day
      let holdLocalCurrent = new Date(localCurrent);
      holdLocalCurrent.setDate(holdLocalCurrent.getDate() + 1);
      localCurrent = holdLocalCurrent.toDateString();
    }
  });

  console.log(grouped);
  return grouped;
};


  /**
   * Formats time display for events based on which day we're viewing
   * Handles single-day and multi-day events differently
   */
  const formatTimeForDate = (event: any, date: Date) => {
    const startDate = new Date(event.start_time);
    const endDate = new Date(event.end_time);
    const isFirstDay = date.toDateString() === startDate.toDateString();
    const isLastDay = date.toDateString() === endDate.toDateString();

    if (isFirstDay && isLastDay) {
      // Same day event - show start time
      return startDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } else if (isFirstDay) {
      // First day of multi-day event
      return `${startDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })} →`;
    } else if (isLastDay) {
      // Last day of multi-day event
      return `→ ${endDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}`;
    } else {
      // Middle day of multi-day event
      return 'All day';
    }
  };

  // Get events organized by date
  const eventsByDate = groupEventsByDate(rawEvents);

  /**
   * Generates array of Date objects for all days in the specified month
   */
  const generateDaysForMonth = (year: number, month: number) => {
    const days = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  // Event handlers
  const handleSelectDate = (date: Date) => {
    console.log('Selected date:', date);
    setSelectedDate(date);
  };

  const handleAddEvent = (date: Date) => {
    setSelectedEvent({ date: date.toISOString().split('T')[0] });
    setEventModalMode('create');
  };

  const handleEditEvent = (event: any) => {
    setSelectedEvent(event);
    setEventModalMode('edit');
  };

  /**
   * Saves or updates an event
   * Creates new event or updates existing based on modal mode
   */
  const handleSaveEvent = (eventData: any) => {
    if (eventModalMode === 'create') {
      const newEvent = {
        ...eventData,
        id: Date.now(), // Use timestamp as ID for uniqueness
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setRawEvents([...rawEvents, newEvent]);
    } else { // Does it edit properly
      setRawEvents(
        rawEvents.map((e) =>
          e.id === eventData.id
            ? { ...eventData, updated_at: new Date().toISOString() }
            : e,
        ),
      );
    }
    setSelectedEvent(null);
  };

  /**
   * Deletes an event by ID
   */
  const handleDeleteEvent = (eventId: number) => {
    setRawEvents(rawEvents.filter((e) => e.id !== eventId));
    setSelectedEvent(null);
  };

  /**
   * Handles AI suggestions to add/modify events
   * This function will be called by the AI chat component
   */
  const handleAISuggestion = (suggestion: any) => {
    // Process AI suggestion and update calendar accordingly
    console.log('AI Suggestion received:', suggestion);
    
    // Example: AI suggests adding an event
    if (suggestion.type === 'add_event') {
      const newEvent = {
        id: Date.now(),
        title: suggestion.title,
        description: suggestion.description || '',
        start_time: suggestion.start_time,
        end_time: suggestion.end_time,
        location: suggestion.location || '',
        all_day: suggestion.all_day || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setRawEvents([...rawEvents, newEvent]);
    }
    
    // Example: AI suggests modifying an event
    if (suggestion.type === 'modify_event') {
      setRawEvents(
        rawEvents.map((e) =>
          e.id === suggestion.event_id
            ? { ...e, ...suggestion.changes, updated_at: new Date().toISOString() }
            : e,
        ),
      );
    }
  };

  // Generate days for current month
  const currentDays = generateDaysForMonth(
    currentDate.getFullYear(),
    currentDate.getMonth(),
  );

  if (selectedDate){
    console.log("Selected date" , selectedDate)
    console.log("Formatted selected", selectedDate.toISOString().split('T')[0])
    console.log("Test select" , selectedDate ? eventsByDate[selectedDate.toISOString().split('T')[0]] : [])
  }

  return (
    <view className="calendar-app">
      {/* Top Half - Calendar View */}
      <view className="calendar-section">
        <CalendarHeader
          currentDate={currentDate}
          onNextMonth={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
            )
          }
          onPrevMonth={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
            )
          }
        />
        <CalendarGrid
          days={currentDays}
          onSelectDate={handleSelectDate}
          events={eventsByDate}
        />
      </view>

      {/* Bottom Half - AI Chat Interface */}
      {/* <view className="ai-chat-section">
        <AIChat 
          events={rawEvents}
          onAISuggestion={handleAISuggestion}
        />
      </view> */}

      {/* Modals */}
      {selectedDate && (
        <DayModal
          date={selectedDate}
          events={eventsByDate[selectedDate.toDateString()] || []}
          onClose={() => setSelectedDate(null)}
          onAddEvent={handleAddEvent}
          onEditEvent={handleEditEvent}
        />
      )}

      {selectedEvent && (
        <EventModal
          mode={eventModalMode}
          eventData={selectedEvent}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </view>
  );
}