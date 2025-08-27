interface CalendarHeaderProps {
    currentDate: Date
    onNextMonth: () => void
    onPrevMonth: () => void
}

import Button from './Button.js'
import './CalendarHeader.css'

export default function CalendarHeader({ currentDate, onNextMonth, onPrevMonth }: CalendarHeaderProps) {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return (
    <view className='calendar-header'>
      <text className='calendar-header-title'>{`${monthNames[month]} ${year}`}</text>
      <view className='calendar-header-buttons'>
        <Button onClick={onPrevMonth}>Previous</Button>
        <Button onClick={onNextMonth}>Next</Button>
      </view>
    </view>
  )
}
