import { useState } from '@lynx-js/react';
import './AIChatBox.css';
import ChatInput from './ChatInput.js';
import MessageList from './MessageList.js';
import MessageItem from './MessageItem.js';
import { ad } from 'vitest/dist/chunks/reporters.d.BFLkQcL6.js';

export interface Message {
  sender: string;
  text: string;
}

export default function AIChatbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendPromptToAI = async (prompt: string) => {
    //add user message to the list
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: prompt },
    ]);
    setLoading(true);
    try {
      //Call backend
      const request = new Request('http://localhost:3001/prompt');
      const json = await fetch(request, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      }).then((res) => res.json());

      if (json && json.response) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'ai', text: json.response },
        ]);
      }

      //Save response to message list
    } catch (error) {
      console.error('Error communicating with AI:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: '❌ Error talking to AI' },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <view className='ai-chatbox'>
      <MessageList messageList={messages}/>
      <ChatInput onSendMessage={sendPromptToAI} />
    </view>
  );
}
