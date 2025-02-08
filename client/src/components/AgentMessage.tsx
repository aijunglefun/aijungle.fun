import React from 'react';
import CircleCountdown from './CircleCountdown';

interface Message {
  id: string;
  content: string;
  agentId: string;
  agentName?: string;
  timestamp: Date;
  status: 'typing' | 'answered';
}

interface Props {
  message: Message;
  isFirstAgent: boolean;
}

const AgentMessage: React.FC<Props> = ({ message, isFirstAgent }) => {
  return (
    <div className={`flex ${isFirstAgent ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[90%] rounded-lg p-4 ${
        isFirstAgent 
          ? 'bg-gray-800 rounded-tl-none' 
          : 'bg-yellowgreen-900 rounded-tr-none'
      }`}>
        <div className={`flex justify-between items-center mb-2 min-w-[250px] h-12 ${
          isFirstAgent ? 'text-yellowgreen-400' : 'text-yellowgreen-200'
        }`}>
          <div className="font-semibold">
            {message.agentName || message.agentId}
          </div>
          <div className="flex items-center gap-3">
            {message.status === 'typing' ? (
              <CircleCountdown duration={parseInt(process.env.VITE_DEBATE_DELAY || '10000')} isFirstAgent={isFirstAgent} />
            ) : (
              <div className="text-sm text-gray-400">
                {message.timestamp.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
        {message.status === 'typing' ? (
          <div className="flex space-x-2 h-2 items-center">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
          </div>
        ) : (
          <div className="text-white whitespace-pre-wrap">{message.content}</div>
        )}
      </div>
    </div>
  );
};

export default AgentMessage; 