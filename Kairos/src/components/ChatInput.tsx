import './ChatInput.css';
import { useState } from '@lynx-js/react';

export default function ChatInput() {
  const [inputContent, setInputContent] = useState('');

  const handleSendMessage = () => {
    console.log(inputContent);
    setInputContent('');
  };

  return (
    <view className="chat-input">
      <view className="chat-box">
        <input
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
