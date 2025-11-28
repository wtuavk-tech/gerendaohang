
import React from 'react';
import { BellRing } from 'lucide-react';

interface ToastNotificationProps {
  visible: boolean;
  message: string;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ visible, message }) => {
  return (
    <div 
        className={`
            fixed bottom-8 right-8 z-[100] 
            bg-white border-l-4 border-[#84CC16] rounded-lg shadow-2xl 
            p-4 flex items-center gap-4 max-w-sm
            transition-all duration-500 ease-in-out transform
            ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
    >
        <div className="bg-green-100 p-2 rounded-full text-[#84CC16]">
            <BellRing size={24} />
        </div>
        <div>
            <h4 className="font-bold text-gray-800 text-lg">新消息</h4>
            <p className="text-gray-600 text-base">{message}</p>
        </div>
    </div>
  );
};
