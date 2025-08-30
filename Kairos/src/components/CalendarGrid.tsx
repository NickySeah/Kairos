import './CalendarGrid.css'
import CalendarDayCell from './CalendarDayCell.js'

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface CalendarGridProps {
  days: Date[]
  onSelectDate: (date: Date) => void
  events?: { [key: string]: any[] } // events keyed by date string (YYYY-MM-DD)
}

/**
 * Calendar Grid Component
 * Renders the main calendar view with days of the week header
 * and a grid of day cells showing events
 * Optimized for mobile touch interactions
 */
export default function CalendarGrid({ 
  days, 
  onSelectDate, 
  events = {} 
}: CalendarGridProps) {
  
  /**
   * FIXED: Create a new array instead of modifying the original
   * Calculate empty cells needed at the beginning and end of the month
   */
  const createGridDays = () => {
    if (days.length === 0) return [];
    
    // Start with a copy of the days array
    const gridDays = [...days];
    
    // Calculate empty cells needed at the beginning of the month
    const firstDay = new Date(days[0].getFullYear(), days[0].getMonth(), 1).getDay();
    const lastDay = new Date(days[0].getFullYear(), days[0].getMonth() + 1, 0).getDay();
    
    // Add previous month days at the beginning
    for (let i = 0; i < firstDay; i++) {
      const fillDate = new Date(days[0]);
      fillDate.setDate(fillDate.getDate() - (firstDay - i));
      gridDays.unshift(fillDate);
    }

    // Add next month days at the end
    for (let i = lastDay + 1; i <= 6; i++) {
      const fillDate = new Date(days[days.length - 1]);
      fillDate.setDate(fillDate.getDate() + (i - lastDay));
      gridDays.push(fillDate);
    }
    
    return gridDays;
  };

  const gridDays = createGridDays();
  console.log("Grid days:", gridDays.map(d => d.toDateString()));

  /**
   * Create cells for actual calendar days
   * Each day shows its number and any events as indicator dots
   */
  const dayCells = gridDays.map(date => {
    const dateKey = date.toDateString();
    const dayEvents = events[dateKey] || []; // Get events for this specific date
    
    console.log(`Date: ${dateKey}, Events:`, dayEvents.length);
    
    return (
      <CalendarDayCell
        key={date.getTime()} // Use timestamp as unique key
        date={date}
        events={dayEvents}
        onClickAddEvent={onSelectDate}
      />
    );
  });

  /**
   * Split all cells into rows of 7 (one week per row)
   */
  const rows = [];
  for (let i = 0; i < dayCells.length; i += 7) {
    rows.push(
      <view className="calendar-row" key={`week-${Math.floor(i / 7)}`}>
        {dayCells.slice(i, i + 7)}
      </view>
    );
  }

  return (
    <view className="calendar-grid-container">
      {/* Header row with days of week */}
      <view className="calendar-row">
        {daysOfWeek.map(day => (
          <view key={day} className="calendar-cell header">
            <text className="header-text">{day.charAt(0)}</text>
          </view>
        ))}
      </view>
      
      {/* Calendar grid with actual days */}
      <view className="calendar-grid">
        {rows}
      </view>
    </view>
  );
}