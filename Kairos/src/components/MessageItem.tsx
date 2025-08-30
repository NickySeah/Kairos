import { Background } from "@lynx-js/types";
import './MessageItem.css'

interface MessageItemProps {
   message?: string;
   sender?: string;
}


export default function MessageItem({
   message='',
   sender='user',
}:MessageItemProps){
   return (
        <view className = {`${sender}-message message-item`}>
            <text>
               {message}
            </text>
         </view>
   );
}