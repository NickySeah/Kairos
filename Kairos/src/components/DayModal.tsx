import './DayModal.css';
import Button from './Button.js';
import BigEventCard from './BigEventCard.js';

interface DayModalProps {
  date: Date;
  events: any[];
  onClose: () => void;
  onAddEvent: (date: Date) => void;
  onEditEvent: (event: any) => void;
}

/**
 * Day Detail Modal Component
 * Shows detailed timeline view for a specific day
 * Displays all events with precise timing and allows editing
 * Optimized for mobile viewing and interaction
 */
export default function DayModal({ 
  date, 
  events, 
  onClose, 
  onAddEvent, 
  onEditEvent 
}: DayModalProps) {
  
  /**
   * Generates 24-hour timeline slots for the day view
   */
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push({
        hour,
        time: `${hour.toString().padStart(2, '0')}:00`,
        period: hour < 12 ? 'AM' : 'PM',
        displayHour: hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  /**
   * Calculates position and height for event cards based on timing
   * Returns CSS style object with top position and height
   */
  const getEventStyle = (event: any) => {
    const startTime = new Date(event.start_time);
    const endTime = new Date(event.end_time);
    
    // Calculate vertical position based on start time
    const startHour = startTime.getHours();
    const startMinutes = startTime.getMinutes();
    const topPosition = (startHour + startMinutes / 60) * 8; // 8vw per hour
    
    // Calculate height based on event duration
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    const height = Math.max(durationHours * 8, 4); // Minimum 4vw height for touch
    
    return {
      top: `${topPosition}vw`,
      height: `${height}vw`,
    };
  };

  /**
   * Formats date for modal title display
   */
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**
   * Formats time slot display with 12-hour format option
   */
  const formatTimeSlot = (slot: any) => {
    // For mobile, show both 24h and 12h format
    return `${slot.time}`; // Keep 24h for simplicity
  };

  /**
   * Filters events to only show those for the selected date
   * Handles timezone considerations
   */
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.start_time);
    return eventDate.toDateString() === date.toDateString();
  });

  return (
    <view className="day-modal-overlay">
      <view className="day-modal" bindtap={(e) => e.stopPropagation()}>
        {/* Modal header with date and actions */}
        <view className="day-modal-header">
          <text className="day-modal-title">{formatDate(date)}</text>
          <view className="day-modal-header-actions">
            <Button 
              onClick={() => onAddEvent(date)} 
              className="add-event-btn"
              variant="success"
            >
              + Add
            </Button>
            <Button 
              onClick={onClose} 
              className="close-btn"
              variant="danger"
            >
              X
            </Button>
          </view>
        </view>
        
        {/* Timeline view container */}
        <scroll-view className="day-timeline-container">
          {/* Left side - Hour timeline */}
          <view className="timeline">
            {timeSlots.map((slot) => (
              <view key={slot.hour} className="time-slot">
                <text className="time-label">{formatTimeSlot(slot)}</text>
                <view className="time-line" />
              </view>
            ))}
          </view>
          
          {/* Right side - Events track */}
          <view className="events-track">
            {todayEvents.map((event, index) => (
              <BigEventCard
                key={`${event.id}-${index}`}
                event={event}
                style={getEventStyle(event)}
                onEdit={() => onEditEvent(event)}
              />
            ))}
            
            {/* Empty state when no events */}
            {todayEvents.length === 0 && (
              <view className="empty-day-state">
                <text className="empty-day-text">
                  📅 No events scheduled
                  {events.map((event, index) => (
                      <text key={index}> {event.title} {new Date(event.start_time).toDateString()} </text>
                    ))}                </text>
                <text className="empty-day-subtitle">
                  Tap "Add" to create your first event
                </text>
              </view>
            )}
          </view>
        </scroll-view>
      </view>
    </view>
  );
}