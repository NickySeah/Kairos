import './CalendarDayCell.css';
import MiniEventCard from './MiniEventCard.js';

interface CalendarDayCellProps {
  date: Date;
  events: any[];
  onClickAddEvent: (date: Date) => void;
}

export default function CalendarDayCell({
  date,
  events,
  onClickAddEvent,
}: CalendarDayCellProps) {
  const dayNumber = date.getDate();
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  const handleClick = () => {
    onClickAddEvent(date);
  };

  // Helper function to generate color based on event id
  const getEventColor = (id: number) => {
    const colors = [
      '#ff5722',
      '#4caf50',
      '#2196f3',
      '#9c27b0',
      '#ff9800',
      '#607d8b',
    ];
    return colors[id % colors.length];
  };

  // Show up to 6 dots, then show count for remaining
  const maxDots = 6;
  const visibleEvents = events.slice(0, maxDots);
  const remainingCount = events.length - maxDots;

  return (
    <view
      className={`calendar-day-cell ${isToday ? 'today' : ''}`}
      bindtap={handleClick}
    >
      <text className="day-number">{dayNumber}</text>
      {events.length > 0 && (
        <view className="events-container">
          <view className="event-dots">
            {visibleEvents.map((event, index) => (
              <MiniEventCard
                key={`${event.id}-${index}`}
                id={event.id}
                color={getEventColor(event.id)}
                onPress={(id) => console.log('Clicked event', id)}
              />
            ))}
          </view>
          {remainingCount > 0 && (
            <text className="more-events">+{remainingCount}</text>
          )}
        </view>
      )}
    </view>
  );
}
