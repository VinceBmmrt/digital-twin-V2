'use client';

import { Copy, Check } from 'lucide-react';
import { Message } from '../types/types';
import { TypedText } from './TypedText';
import { MarkdownContent } from './MarkdownContent';

interface AssistantMessageProps {
    message: Message;
    idx: number;
    isLast: boolean;
    copiedId: string | null;
    onCopy: (text: string, id: string) => void;
}

export default function AssistantMessage({ message, idx, isLast, copiedId, onCopy }: AssistantMessageProps) {
const mono: React.CSSProperties = { fontFamily: 'DM Mono, monospace' };
const display: React.CSSProperties = { fontFamily: 'Syne, sans-serif' };
    
    return (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '4px', background: 'linear-gradient(135deg,rgba(99,179,255,.18),rgba(99,179,255,.06))', border: '1px solid rgba(99,179,255,.2)' }}>
                <span style={{ ...display, color: '#63b3ff', fontSize: '10px', fontWeight: 700 }}>VB</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ ...display, fontSize: '10px', color: '#63b3ff', fontWeight: 600, letterSpacing: '.03em' }}>Vincent Bommert</span>
                    <span style={{ ...mono, fontSize: '9px', color: '#2a4a6a' }}>
                        {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ ...mono, fontSize: '8px', color: '#2a4a6a' }}>MSG_{String(idx).padStart(3, '0')}</span>
                        <button 
                            onClick={() => onCopy(message.content, message.id)} 
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', cursor: 'pointer', background: copiedId === message.id ? 'rgba(74,222,128,.1)' : 'rgba(99,179,255,.06)', border: copiedId === message.id ? '1px solid rgba(74,222,128,.3)' : '1px solid rgba(99,179,255,.14)' }}>
                            {copiedId === message.id ? <Check size={9} color="#4ade80" /> : <Copy size={9} color="#4a7a9b" />}
                            <span style={{ ...mono, fontSize: '8px', color: copiedId === message.id ? '#4ade80' : '#4a7a9b' }}>
                                {copiedId === message.id ? 'Copié' : 'Copier'}
                            </span>
                        </button>
                    </div>
                </div>
                <div className="glass-msg" style={{ borderRadius: '4px 16px 16px 16px', padding: '16px 20px' }}>
                    {isLast && message.role === 'assistant' ? <TypedText text={message.content} /> : <MarkdownContent content={message.content} />}
                </div>
            </div>
        </div>
    );
}