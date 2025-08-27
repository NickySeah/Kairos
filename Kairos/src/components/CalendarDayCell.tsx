import './CalendarDayCell.css'

interface CalendarDayCellProps {
  date: Date
  events: any[]
  onClickAddEvent: (date: Date) => void
}

export default function CalendarDayCell({ date, events, onClickAddEvent }: CalendarDayCellProps) {
  const dayNumber = date.getDate()
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()

  const handleClick = () => {
    onClickAddEvent(date)
  }

  return (
    <view 
      className={`calendar-day-cell ${isToday ? 'today' : ''}`}
      bindtap={handleClick}
    >
      <text className="day-number">{dayNumber}</text>
      {events.length > 0 && (
        <view className="events-container">
          {events.slice(0, 2).map((event, index) => (
            <view key={index} className="event-item">
              <text className="event-text">{event.title || 'Event'}</text>
            </view>
          ))}
          {events.length > 2 && (
            <text className="more-events">+{events.length - 2} more</text>
          )}
        </view>
      )}
    </view>
  )
}