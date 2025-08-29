interface MiniEventCardProps {
  id: string | number;
  color?: string;
  onPress?: (id: string | number) => void;
}

import './MiniEventCard.css';

/**
 * Small event indicator dot for calendar day cells
 * Shows a colored dot representing an event
 * Optimized for mobile touch interactions
 */
export default function MiniEventCard({
  id,
  color,
  onPress,
}: MiniEventCardProps) {
  return (
    <view
      className="mini-event-dot"
      style={{ backgroundColor: color || '#4a90e2' }}
      bindtap={() => onPress && onPress(id)}
    />
  );
}