import './ChatInput.css';
import { useState } from '@lynx-js/react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [inputContent, setInputContent] = useState('');

  const handleSendMessage = () => {
    if (inputContent.trim()) {
      console.log(inputContent);
      onSendMessage(inputContent);
    }

    // Clear the input using the setValue method
    lynx
      .createSelectorQuery()
      .select('#chatInput')
      .invoke({
        method: 'setValue',
        params: {
          value: '',
        },
      })
      .exec();

    setInputContent('');
    //Send message to server or perform desired action
    //Show message bubble
  };

  return (
    <view className="chat-input">
      <view className="chat-box">
        <input
            id="chatInput"
          placeholder="Message"
          bindinput={(res: any) => {
            console.log(res.detail.value);
            setInputContent(res.detail.value);
          }}
        />
      </view>

      <view className="circular-button" bindtap={handleSendMessage}>
        <text>Circular Button</text>
      </view>
    </view>
  );
}
