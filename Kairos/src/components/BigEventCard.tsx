import './BigEventCard.css';

interface BigEventCardProps {
  event: any;
  style: any;
  onEdit: () => void;
}

export default function BigEventCard({ event, style, onEdit }: BigEventCardProps) {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

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

  return (
    <view
      className="big-event-card"
      style={{
        ...style,
        backgroundColor: getEventColor(event.id),
      }}
      bindtap={onEdit}
    >
      <text className="event-title">{event.title}</text>
      <text className="event-time">
        {formatTime(event.start_time)} - {formatTime(event.end_time)}
      </text>
      {event.location && (
        <text className="event-location">📍 {event.location}</text>
      )}
      {event.description && (
        <text className="event-description">{event.description}</text>
      )}
    </view>
  );
}