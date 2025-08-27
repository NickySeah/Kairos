import './CalendarGrid.css'
import CalendarDayCell from './CalendarDayCell.js'

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface CalendarGridProps {
  days: Date[]
  onSelectDate: (date: Date) => void
  events?: { [key: string]: any[] } // events keyed by date string
}

export default function CalendarGrid({ days, onSelectDate, events = {} }: CalendarGridProps) {
  // Get first day of the month to calculate empty cells
  const firstDay = days.length > 0 ? new Date(days[0].getFullYear(), days[0].getMonth(), 1).getDay() : 0
  
  // Create empty cells for days before the first day of the month
  const emptyCells = []
  for (let i = 0; i < firstDay; i++) {
    emptyCells.push(
      <view key={`empty-${i}`} className="calendar-cell empty" />
    )
  }

  // Create cells for actual days
  const dayCells = days.map(date => {
    const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD format
    const dayEvents = events[dateKey] || []
    
    return (
      <CalendarDayCell
        key={date.getTime()}
        date={date}
        events={dayEvents}
        onClickAddEvent={onSelectDate}
      />
    )
  })

  // Combine empty cells and day cells
  const allCells = [...emptyCells, ...dayCells]

  // Fill remaining cells to complete the last week
  while (allCells.length % 7 !== 0) {
    allCells.push(
      <view key={`empty-end-${allCells.length}`} className="calendar-cell empty" />
    )
  }

  // Split cells into rows of 7
  const rows = []
  for (let i = 0; i < allCells.length; i += 7) {
    rows.push(
      <view className="calendar-row" key={`row-${i / 7}`}>
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
            <text style={{ fontWeight: 'bold', color: '#333' }}>{day}</text>
          </view>
        ))}
      </view>
      {/* Calendar grid */}
      <view className="calendar-grid">
        {rows}
      </view>
    </view>
  )
}