import { useState, useEffect, useRef } from '@lynx-js/react';
import './EventModal.css';
import Button from './Button.js';

interface LynxInputRef {
  setValue: (params: { value: string }) => void;
  getValue: (callback?: { success?: (result: { value: string }) => void }) => void;
  focus: () => void;
  blur: () => void;
}

interface EventModalProps {
  mode: 'create' | 'edit';
  eventData?: any;
  onSave: (eventData: any) => void;
  onDelete?: (eventId: number) => void;
  onClose: () => void;
}

/**
 * Event Modal Component
 * Handles creation and editing of calendar events
 * Optimized for mobile input and touch interactions
 */
export default function EventModal({
  mode,
  eventData = {},
  onSave,
  onDelete,
  onClose,
}: EventModalProps) {
  // Form state
  const [title, setTitle] = useState(eventData.title || '');
  const [description, setDescription] = useState(eventData.description || '');
  const [location, setLocation] = useState(eventData.location || '');
  const [startTime, setStartTime] = useState(
    eventData.start_time
      ? new Date(eventData.start_time).toISOString().slice(0, 16)
      : eventData.date
        ? `${eventData.date}T09:00`
        : new Date().toISOString().slice(0, 16),
  );
  const [endTime, setEndTime] = useState(
    eventData.end_time
      ? new Date(eventData.end_time).toISOString().slice(0, 16)
      : eventData.date
        ? `${eventData.date}T10:00`
        : new Date(Date.now() + 3600000).toISOString().slice(0, 16), // +1 hour
  );

  // Input references for Lynx.js form handling
  const titleInputRef = useRef<any>(null);
  const descriptionInputRef = useRef<any>(null);
  const locationInputRef = useRef<any>(null);
  const startTimeInputRef = useRef<any>(null);
  const endTimeInputRef = useRef<any>(null);

  /**
   * Initialize form values when modal opens or event data changes
   */
  useEffect(() => {
    // Set initial values in Lynx input components
    if (titleInputRef.current) {
      titleInputRef.current.setValue({ value: title });
    }
    if (descriptionInputRef.current) {
      descriptionInputRef.current.setValue({ value: description });
    }
    if (locationInputRef.current) {
      locationInputRef.current.setValue({ value: location });
    }
    if (startTimeInputRef.current) {
      startTimeInputRef.current.setValue({ value: startTime });
    }
    if (endTimeInputRef.current) {
      endTimeInputRef.current.setValue({ value: endTime });
    }
  }, [eventData, title, description, location, startTime, endTime]);

  /**
   * Validates form data before saving
   */
  const validateForm = () => {
    if (!title.trim()) {
      alert('Please enter an event title');
      return false;
    }
    
    if (!startTime || !endTime) {
      alert('Please enter both start and end times');
      return false;
    }
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (start >= end) {
      alert('End time must be after start time');
      return false;
    }
    
    return true;
  };

  /**
   * Handles saving event (create or update)
   */
  const handleSave = () => {
    onClose();
    if (!validateForm()) return;
    
    const eventToSave = {
      ...eventData,
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      all_day: null,
    };
    
    onSave(eventToSave);
  };

  /**
   * Handles delete confirmation and execution
   */
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this event?')) {
      onDelete && onDelete(eventData.id);
    }
  };

  /**
   * Formats current date/time for input default values
   */
  const formatDateTime = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  return (
    <view className="event-modal-overlay">
      <view className="event-modal" bindtap={(e) => e.stopPropagation()}>
        <text className="event-modal-title">
          {mode === 'create' ? '✨ Add New Event' : '📝 Edit Event'}
        </text>

        {/* Event title input */}
        <view className="input-group">
          <text className="input-label">Event Title *</text>
          <input
            ref={titleInputRef}
            placeholder="Enter event title..."
            bindinput={(res) => setTitle(res.detail.value)}
            className="event-modal-input"
            maxlength={100}
          />
        </view>

        {/* Event description textarea */}
        <view className="input-group">
          <text className="input-label">Description</text>
          <textarea
            ref={descriptionInputRef}
            placeholder="Add event description..."
            bindinput={(res) => setDescription(res.detail.value)}
            className="event-modal-input textarea"
            maxlength={500}
          />
        </view>

        {/* Event location input */}
        <view className="input-group">
          <text className="input-label">Location</text>
          <input
            ref={locationInputRef}
            placeholder="Event location..."
            bindinput={(res) => setLocation(res.detail.value)}
            className="event-modal-input"
            maxlength={200}
          />
        </view>

        {/* Time inputs */}
        <view className="event-modal-time-inputs">
          <view className="input-group time-input">
            <text className="input-label">Start Time *</text>
            <input
              ref={startTimeInputRef}
              type="text"
              bindinput={(res) => setStartTime(res.detail.value)}
              className="event-modal-input"
            />
          </view>
          
          <view className="input-group time-input">
            <text className="input-label">End Time *</text>
            <input
              ref={endTimeInputRef}
              type="text"
              bindinput={(res) => setEndTime(res.detail.value)}
              className="event-modal-input"
            />
          </view>
        </view>

        {/* Action buttons */}
        <view className="event-modal-actions">
          <Button onClick={onClose} className="event-modal-cancel" variant="secondary">
            Cancel
          </Button>
          
          {mode === 'create' && (
            <Button onClick={handleSave} className="event-modal-add" variant="success">
              Add Event
            </Button>
          )}
          
          {mode === 'edit' && (
            <>
              <Button
                onClick={handleDelete}
                className="event-modal-delete"
                variant="danger"
              >
                Delete
              </Button>
              <Button onClick={handleSave} className="event-modal-save" variant="success">
                Save Changes
              </Button>
            </>
          )}
        </view>
      </view>
    </view>
  );
}