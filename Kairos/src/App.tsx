import { useCallback, useEffect, useState } from '@lynx-js/react'

import './App.css'
import Calendar from './components/Calendar.js'
import EventModal from './components/EventModal.js'
import Button from './components/Button.js'
import arrow from './assets/arrow.png'
import lynxLogo from './assets/lynx-logo.png'
import reactLynxLogo from './assets/react-logo.png'
import MessageItem from './components/MessageItem.js'
import ChatInput from './components/ChatInput.js'
import MessageList from './components/MessageList.js'

export function App() {
  const messageListMock = [
    { message: "Hello Everybadyyy 👋", variant: "user" },
    { message: "Hi! How’s everything going today?", variant: "ai" },
    { message: "Just testing the chat interface.", variant: "user" },
    { message: "Great! Let’s see how it handles long messages. This message is intentionally verbose to test text wrapping and overflow inside the chat bubble. It should span multiple lines without breaking the layout.", variant: "ai" },
    { message: "Cool, looks good so far.", variant: "user" },
    { message: "Here’s another long AI message for testing purposes. It should be displayed properly and scrollable if needed.", variant: "ai" },
    { message: "Short message from user.", variant: "user" },
    { message: "Final AI message to ensure everything works as expected.", variant: "ai" },
        { message: "Hello Everybadyyy 👋", variant: "user" },
    { message: "Hi! How’s everything going today?", variant: "ai" },
    { message: "Just testing the chat interface.", variant: "user" },
    { message: "Great! Let’s see how it handles long messages. This message is intentionally verbose to test text wrapping and overflow inside the chat bubble. It should span multiple lines without breaking the layout.", variant: "ai" },
    { message: "Cool, looks good so far.", variant: "user" },
    { message: "Here’s another long AI message for testing purposes. It should be displayed properly and scrollable if needed.", variant: "ai" },
    { message: "Short message from user.", variant: "user" },
    { message: "Final AI message to ensure everything works as expected.", variant: "ai" },
        { message: "Hello Everybadyyy 👋", variant: "user" },
    { message: "Hi! How’s everything going today?", variant: "ai" },
    { message: "Just testing the chat interface.", variant: "user" },
    { message: "Great! Let’s see how it handles long messages. This message is intentionally verbose to test text wrapping and overflow inside the chat bubble. It should span multiple lines without breaking the layout.", variant: "ai" },
    { message: "Cool, looks good so far.", variant: "user" },
    { message: "Here’s another long AI message for testing purposes. It should be displayed properly and scrollable if needed.", variant: "ai" },
    { message: "Short message from user.", variant: "user" },
    { message: "Final AI message to ensure everything works as expected.", variant: "ai" },
        { message: "Hello Everybadyyy 👋", variant: "user" },
    { message: "Hi! How’s everything going today?", variant: "ai" },
    { message: "Just testing the chat interface.", variant: "user" },
    { message: "Great! Let’s see how it handles long messages. This message is intentionally verbose to test text wrapping and overflow inside the chat bubble. It should span multiple lines without breaking the layout.", variant: "ai" },
    { message: "Cool, looks good so far.", variant: "user" },
    { message: "Here’s another long AI message for testing purposes. It should be displayed properly and scrollable if needed.", variant: "ai" },
    { message: "Short message from user.", variant: "user" },
    { message: "Final AI message to ensure everything works as expected.", variant: "ai" },
    
  ];
  return (
    <view>
      <MessageList messageList= {messageListMock}/>
    </view>
  )
}

export default App;
