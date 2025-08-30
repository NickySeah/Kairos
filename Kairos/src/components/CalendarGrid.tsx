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
   * Calculate empty cells needed at the beginning of the month
   * Based on which day of the week the month starts
   */
  const firstDay = days.length > 0 
    ? new Date(days[0].getFullYear(), days[0].getMonth(), 1).getDay() 
    : 0
  
  /**
   * Create empty cells for days before the first day of the month
   * This ensures proper calendar alignment
   */
  const emptyCells = []
  for (let i = 0; i < firstDay; i++) {
    emptyCells.push(
      <view key={`empty-start-${i}`} className="calendar-cell empty" />
    )
  }

  /**
   * Create cells for actual calendar days
   * Each day shows its number and any events as indicator dots
   */
  const dayCells = days.map(date => {
    const dateKey = date.toDateString() 
    const dayEvents = events[dateKey] || [] // Get events for this specific date
    
    return (
      <CalendarDayCell
        key={date.getTime()} // Use timestamp as unique key
        date={date}
        events={dayEvents}
        onClickAddEvent={onSelectDate}
      />
    )
  })

  /**
   * Combine empty cells and actual day cells
   */
  const allCells = [...emptyCells, ...dayCells]

  /**
   * Fill remaining cells to complete the last week
   * Ensures calendar grid is always complete rectangles
   */
  while (allCells.length % 7 !== 0) {
    allCells.push(
      <view key={`empty-end-${allCells.length}`} className="calendar-cell empty" />
    )
  }

  /**
   * Split all cells into rows of 7 (one week per row)
   */
  const rows = []
  for (let i = 0; i < allCells.length; i += 7) {
    rows.push(
      <view className="calendar-row" key={`week-${Math.floor(i / 7)}`}>
        {allCells.slice(i, i + 7)}
      </view>
    )
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
  )
}