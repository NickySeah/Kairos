import { useState, useRef, useEffect } from '@lynx-js/react';
import Button from './Button.js';
import './AIChat.css';

interface AIChatProps {
  events: any[];
  onAISuggestion: (suggestion: any) => void;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

/**
 * AI Chat Interface Component
 * Bottom half of the calendar app for AI interactions
 * Allows users to chat with AI about calendar events and get suggestions
 */
export default function AIChat({ events, onAISuggestion }: AIChatProps) {
  // Chat messages history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hi! I'm your AI calendar assistant. I can help you manage your schedule, suggest events, or answer questions about your calendar. What would you like to do?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  
  // Current input text
  const [inputText, setInputText] = useState('');
  
  // Loading state for AI responses
  const [isLoading, setIsLoading] = useState(false);
  
  // Reference for input field
  const inputRef = useRef<any>(null);
  
  // Reference for messages container (for auto-scroll)
  const messagesRef = useRef<any>(null);

  /**
   * Scrolls to bottom of messages when new message is added
   */
  useEffect(() => {
    if (messagesRef.current) {
      // Auto-scroll to bottom
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * Simulates AI response processing
   * In a real app, this would call your backend API
   */
  const processAIMessage = async (userMessage: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock AI responses based on user input
    let aiResponse = "";
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('meeting') || lowerMessage.includes('schedule')) {
      aiResponse = "I can help you schedule a meeting! Would you like me to suggest some available time slots based on your current calendar?";
      
      // Example AI suggestion
      onAISuggestion({
        type: 'add_event',
        title: 'Suggested Meeting',
        description: 'AI suggested meeting based on your request',
        start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        end_time: new Date(Date.now() + 86400000 + 3600000).toISOString(), // Tomorrow + 1 hour
        location: 'Conference Room'
      });
      
    } else if (lowerMessage.includes('free time') || lowerMessage.includes('available')) {
      aiResponse = `Looking at your calendar, you have ${events.length} events scheduled. I can help you find free time slots. What type of activity are you planning?`;
      
    } else if (lowerMessage.includes('conflict') || lowerMessage.includes('busy')) {
      aiResponse = "I can check for scheduling conflicts. Let me analyze your current events and suggest the best times for new activities.";
      
    } else if (lowerMessage.includes('reminder') || lowerMessage.includes('remind')) {
      aiResponse = "I can help set up reminders for your events! Would you like me to add notification settings to any of your upcoming events?";
      
    } else {
      aiResponse = "I understand you're asking about your calendar. I can help with scheduling meetings, finding free time, checking for conflicts, or setting reminders. What specifically would you like help with?";
    }
    
    // Add AI response to chat
    const aiMessage: ChatMessage = {
      id: Date.now().toString(),
      text: aiResponse,
      isUser: false,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  /**
   * Handles sending a user message
   */
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input
    setInputText('');
    if (inputRef.current) {
      inputRef.current.setValue({ value: '' });
    }
    
    // Process with AI
    await processAIMessage(userMessage.text);
  };

  /**
   * Handles Enter key press in input field
   */
  const handleKeyPress = (e: any) => {
    if (e.detail.keyCode === 13) { // Enter key
      handleSendMessage();
    }
  };

  /**
   * Formats timestamp for message display
   */
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <view className="ai-chat-container">
      {/* Chat header */}
      <view className="chat-header">
        <text className="chat-title">🤖 AI Calendar Assistant</text>
        <text className="chat-subtitle">{events.length} events in your calendar</text>
      </view>
      
      {/* Messages area */}
      <view className="messages-container" ref={messagesRef}>
        {messages.map((message) => (
          <view 
            key={message.id} 
            className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
          >
            <view className="message-content">
              <text className="message-text">{message.text}</text>
              <text className="message-time">{formatTime(message.timestamp)}</text>
            </view>
          </view>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <view className="message ai-message">
            <view className="message-content">
              <view className="typing-indicator">
                <view className="typing-dot"></view>
                <view className="typing-dot"></view>
                <view className="typing-dot"></view>
              </view>
            </view>
          </view>
        )}
      </view>
      
      {/* Input area */}
      <view className="input-container">
        <textarea
          ref={inputRef}
          placeholder="Ask me about your calendar, schedule events, or get suggestions..."
          className="chat-input"
          bindinput={(res) => setInputText(res.detail.value)}
          bindkeydown={handleKeyPress}
        />
        <Button 
          onClick={handleSendMessage} 
          className="send-button"
          variant="primary"
          disabled={!inputText.trim() || isLoading}
        >
          Send
        </Button>
      </view>
    </view>
  );
}