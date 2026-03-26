'use client';

import { Message } from '../types/types';
import UserMessage from './UserMessage';
import AssistantMessage from './AssistantMessage';
import { BarWave } from './BarWave';

interface MessageListProps {
    messages: Message[];
    isLoading: boolean;
    onCopyMessage: (text: string, id: string) => void;
    copiedId: string | null;
}

export default function MessageList({ messages, isLoading, onCopyMessage, copiedId }: MessageListProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {messages.map((msg, idx) => (
                <div key={msg.id} className="msg-in" style={{ animationDelay: `${Math.min(idx * 20, 80)}ms` }}>
                    {msg.role === 'user' ? (
                        <UserMessage message={msg} />
                    ) : (
                        <AssistantMessage 
                            message={msg} 
                            idx={idx}
                            isLast={idx === messages.length - 1}
                            copiedId={copiedId}
                            onCopy={onCopyMessage}
                        />
                    )}
                </div>
            ))}

            {isLoading && (
                <div className="msg-in">
                    <BarWave />
                </div>
            )}
        </div>
    );
}