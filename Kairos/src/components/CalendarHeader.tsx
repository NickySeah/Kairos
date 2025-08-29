interface CalendarHeaderProps {
  currentDate: Date;
  onNextMonth: () => void;
  onPrevMonth: () => void;
}

import Button from './Button.js';
import './CalendarHeader.css';

/**
 * Calendar Header Component
 * Displays current month/year and navigation buttons
 * Optimized for mobile touch interactions
 */
export default function CalendarHeader({
  currentDate,
  onNextMonth,
  onPrevMonth,
}: CalendarHeaderProps) {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // Month names for display
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <view className="calendar-header">
      {/* Current month and year display */}
      <text className="calendar-header-title">
        {`${monthNames[month]} ${year}`}
      </text>
      <view style={{ display: 'flex', gap: '2vw' }}>
      {/* Navigation button - Previous month */}
      <Button onClick={onPrevMonth} className="nav-button" variant="secondary">
        ‹
      </Button>
      {/* Navigation button - Next month */}
      <Button onClick={onNextMonth} className="nav-button" variant="secondary">
        ›
      </Button>
      </view>
    </view>
  );
}
