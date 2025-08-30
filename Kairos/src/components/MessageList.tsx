import './MessageList.css';
import type {Message} from './AIChatbox.js';
import MessageItem from './MessageItem.js';
import {useState} from '@lynx-js/react';
import type AIChatbox from './AIChatbox.js';

interface MessageListProps{
    messageList?:Message[];
}



export default function MessageList({messageList = []}:MessageListProps){
    
   return (
    <view>
        <scroll-view className = "message-list">
            {messageList.map((messageObj, index) => (
                <MessageItem 
                    key={index} 
                    message={messageObj.text} 
                    sender={messageObj.sender} 
                />
            ))}
            {/* // <MessageItem message = 'Hello Everybadyyy' variant='user'/>
            // <MessageItem message = 'Hello User' variant='ai'/>
            // <MessageItem message = 'Hello Everybadyyy' variant='user'/> */}
        </scroll-view>
        </view>
   );
}