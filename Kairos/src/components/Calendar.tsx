import { useState } from '@lynx-js/react';
import CalendarHeader from './CalendarHeader.js';
import CalendarGrid from './CalendarGrid.js';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<{ [key: string]: any[] }>({});

  // Generate days array for the current month
  const generateDaysForMonth = (year: number, month: number) => {
    const days = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const handleSelectDate = (date: Date) => {
    console.log('Selected date:', date);
    // Add your date selection logic here
  };

  const currentDays = generateDaysForMonth(
    currentDate.getFullYear(),
    currentDate.getMonth(),
  );

  return (
    <view>
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
        events={events}
      />
    </view>
  );
}
