import React, { useRef, useEffect, useState, Dispatch, SetStateAction } from 'react';
import AgentMessage from './AgentMessage';
import { Debate } from '../types/Debate';
import axios from 'axios';
import SlotCounter from 'react-slot-counter';
import { PublicKey, Connection } from '@solana/web3.js';

interface ChatInterfaceProps {
  messages: Debate['messages'];
  setMessages: React.Dispatch<React.SetStateAction<Debate['messages']>>;
  debate: Debate | null;
  poolSize: number;
  isPoolUpdated: boolean;
  agentPools: [number, number];
  fetchPools: () => Promise<void>;
  setVerdict: Dispatch<SetStateAction<{
    winner: string;
    explanation: string;
    timestamp: Date;
  } | null>>;
  verdict: {
    winner: string;
    explanation: string;
    timestamp: Date;
  } | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, setMessages, debate, poolSize, isPoolUpdated, agentPools, fetchPools, setVerdict, verdict }) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current && chatContainerRef.current) {
      const chatContainer = chatContainerRef.current;
      const isNearBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 100;
      
      if (!isUserScrolling || isNearBottom) {
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: isFirstLoad ? "auto" : "smooth"
        });
      }
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const chatContainer = chatContainerRef.current;
      const isNearBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 100;
      setIsUserScrolling(!isNearBottom);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const POLL_INTERVAL = 3000;

  const startDebate = async () => {
    if (!debate?._id) return;
    try {
      await axios.post(`/api/debates/${debate._id}/start`);
    } catch (error) {
      console.error('Error starting debate:', error);
    }
  };

  const stopDebate = async () => {
    if (!debate?._id) return;
    try {
      await axios.post(`/api/debates/${debate._id}/pause`);
    } catch (error) {
      console.error('Error stopping debate:', error);
    }
  };

  const clearThread = async () => {
    if (!debate?._id) return;
    try {
      await axios.post(`/api/debates/${debate._id}/clear`);
    } catch (error) {
      console.error('Error clearing thread:', error);
    }
  };

  const pollMessages = async () => {
    if (!debate?._id) return;
    try {
      const response = await axios.get(`/api/debates/${debate._id}/messages`);

      if (response.data.messages.length === 0) {
        startDebate();
        return;
      }

      setMessages(response.data.messages);
      setVerdict(response.data.verdict);
      
      if (isInitialLoading) {
        setIsInitialLoading(false);
      }
    } catch (error) {
      console.error('Error polling messages:', error);
    }
  };

  // Only poll if no verdict exists
  useEffect(() => {
    if (debate?.verdict) {
      pollMessages(); // Load once
      return;
    }
    
    const interval = setInterval(pollMessages, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [debate?.verdict]);

  const totalPool = agentPools[0] + agentPools[1];
  const firstAgentRatio = totalPool > 0 ? (agentPools[0] / totalPool) * 100 : 50;
  const secondAgentRatio = 100 - firstAgentRatio;

  // useEffect(() => {
  //   if (messages.length === 0 && debate?._id) {
  //     startDebate();
  //   }
  // }, [messages, debate]);

  useEffect(() => {
    if (messages.length > 0) {
      if (isFirstLoad) {
        scrollToBottom();
        setIsFirstLoad(false);
      } 
    }
  }, [messages, isFirstLoad]);

  // Initial fetch
  useEffect(() => {
    if (!debate?.solanaAddress) return;
    
    fetchPools(); // Initial fetch
    const interval = setInterval(fetchPools, 5000);
    
    return () => clearInterval(interval);
  }, [debate?.solanaAddress]);

  useEffect(() => {
    // stopDebate();
    // clearThread();
  }, []);

  return (
    <div className="flex flex-col h-[930px] bg-gray-900 rounded-lg shadow-xl">
      {/* Debate Header */}
      <div className="bg-gray-800 p-4 rounded-t-lg border-b border-gray-700">
        <div className="flex justify-between items-center">
          <div>
          <h2 className="text-xl font-bold text-white">
          {debate?.title || 'Loading debate...'}
          </h2>
          <p className="text-gray-400 mt-1">{debate?.description}</p>
          </div>

          {/* <div className="text-yellowgreen-400 w-60">
            <span className="lowercase">pool size: </span>
            <span className={`transition-all duration-500 ${isPoolUpdated ? 'text-yellowgreen-100' : ''}`}>
              <SlotCounter 
                value={Number(poolSize) ? (poolSize / 1000000000).toFixed(2) : 0.00}
                duration={1}
                startValue="0.00"
                useMonospaceWidth
                charClassName="font-mono"
              />
            </span>
            <span> SOL</span>
          </div>         */}
          </div>

          {/* Pool ratio bar */}
          <div className="mt-4">
            {/* Agent names */}
            <div className="flex justify-between mb-1 text-xs">
              <span className={`${firstAgentRatio >= secondAgentRatio ? 'text-yellowgreen-400' : 'text-red-400'}`}>
                {debate?.agents[0].name}
              </span>
              <span className={`${secondAgentRatio > firstAgentRatio ? 'text-yellowgreen-400' : 'text-red-400'}`}>
                {debate?.agents[1].name}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${firstAgentRatio >= secondAgentRatio ? 'bg-yellowgreen-400' : 'bg-red-400'} transform transition-all duration-500 ease-out`}
                style={{ 
                  width: `${firstAgentRatio}%`,
                  boxShadow: firstAgentRatio >= secondAgentRatio ? 
                    '0 0 10px rgba(154, 230, 180, 0.3)' : 
                    '0 0 10px rgba(245, 101, 101, 0.3)',
                  transformOrigin: 'center'
                }}
              />
              <div 
                className={`h-full ${secondAgentRatio > firstAgentRatio ? 'bg-yellowgreen-400' : 'bg-red-400'} transform transition-all duration-500 ease-out`}
                style={{ 
                  width: `${secondAgentRatio}%`,
                  marginLeft: `${firstAgentRatio}%`,
                  marginTop: '-6px',
                  boxShadow: secondAgentRatio > firstAgentRatio ? 
                    '0 0 10px rgba(154, 230, 180, 0.3)' : 
                    '0 0 10px rgba(245, 101, 101, 0.3)',
                  transformOrigin: 'center'
                }}
              />
            </div>

            {/* Pool amounts */}
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span className={`transition-all duration-500 ${isPoolUpdated ? firstAgentRatio >= secondAgentRatio ? 'text-yellowgreen-400' : 'text-red-400' : ''}`}>
                {(agentPools[0] / 1000000000).toFixed(2)} SOL
              </span>
              <span className={`transition-all duration-500 ${isPoolUpdated ? secondAgentRatio > firstAgentRatio ? 'text-yellowgreen-400' : 'text-red-400' : ''}`}>
                {(agentPools[1] / 1000000000).toFixed(2)} SOL
              </span>
            </div>
          </div>
        </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth"
        onScroll={handleScroll}
      >
        {isInitialLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : messages.length > 0 ? (
          messages.map((message, index) => (
            <AgentMessage 
              key={index}
              message={{
                id: index.toString(),
                content: message.content,
                agentId: message.agentId,
                agentName: message.name,
                status: message.status,
                timestamp: new Date(message.timestamp)
              }}
              isFirstAgent={message.agentId === debate?.agents[0].name}
            />
          ))
        ) : (
          <div className="text-center text-gray-400">No messages yet</div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>    
  
  );
};

export default ChatInterface; 