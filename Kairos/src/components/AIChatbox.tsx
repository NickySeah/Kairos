import { useState } from '@lynx-js/react';
import './AIChatBox.css';
import ChatInput from './ChatInput.js';
import MessageList from './MessageList.js';
import MessageItem from './MessageItem.js';

export interface Message {
  sender: string;
  text: string;
}

export default function AIChatbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendPromptToAI = async (prompt: string) => {
    // Validate input
    if (!prompt || prompt.trim() === '') {
      console.error('Input data is empty');
      return;
    }

    // Test connectivity first
    try {
      const healthCheck = await fetch('http://localhost:3001/health', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      console.log('Health check:', healthCheck.status);
    } catch (healthError) {
      console.error('Health check failed:', healthError);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: '❌ Cannot connect to server. Please check if your backend is running on port 3001.' },
      ]);
      return;
    }

    // Add user message to the list
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: prompt },
    ]);
    
    setLoading(true);
    
    // Add processing message to let user know request is ongoing
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'ai', text: '🤔 Processing your request...' },
    ]);
    
    let response: Response | undefined;
    let json: any = undefined;
    let errorMessage = '';

    try {
      // Call backend with LynxJS-compatible configuration
      response = await fetch('http://192.168.1.131:3001/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ "prompt": prompt }),
        // Explicitly disable features that LynxJS doesn't support
        mode: undefined, // Remove CORS mode
        credentials: undefined, // Remove credentials
        redirect: undefined, // Remove redirect handling
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON format');
      }

      json = await response.json();

      // Validate JSON response structure
      if (!json) {
        throw new Error('Empty JSON response received');
      }

      if (json.error) {
        throw new Error(`Server error: ${json.error}`);
      }

      if (!json.response) {
        throw new Error('No response field in JSON data');
      }

      // Add AI response to messages (replace processing message)
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        // Remove the processing message (last message should be the processing one)
        if (updatedMessages[updatedMessages.length - 1]?.text.includes('Processing your request')) {
          updatedMessages.pop();
        }
        return [
          ...updatedMessages,
          { sender: 'ai', text: json.response },
        ];
      });

    } catch (error: any) {
      console.error('Error communicating with AI:', error);
      
      // Create detailed error message based on error type
      if (error.name === 'AbortError') {
        errorMessage = '❌ Request timed out. Please try again.';
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = '❌ Network error. Please check your connection and try again.';
      } else if (response?.status === 499) {
        errorMessage = '❌ Request was cancelled. Please try again.';
      } else if (response?.status && response.status >= 500) {
        errorMessage = '❌ Server error. Please try again later.';
      } else if (response?.status && response.status >= 400) {
        errorMessage = `❌ Client error (${response.status}): ${error.message}`;
      } else {
        errorMessage = `❌ Error: ${error.message || 'Unknown error occurred'}`;
      }

      // Add error message to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: errorMessage },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <view className="ai-chatbox">
      <MessageList messageList={messages} />
      <ChatInput onSendMessage={sendPromptToAI} />
    </view>
  );
}