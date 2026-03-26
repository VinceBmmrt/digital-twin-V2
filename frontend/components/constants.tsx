import { Sparkles, Cpu, Database, Globe } from 'lucide-react';
import type { Suggestion, Skill, System } from '../types/types';

export const BOOT_LINES: [string, string, boolean][] = [
    ['> INITIALIZING AI DIGITAL TWIN...', '#3a7a6a', false],
    ['> LOADING LLM CONTEXT WINDOW.............. OK', '#3a8a70', false],
    ['> MOUNTING EXPERIENCE CORPUS...... OK', '#4a9a80', false],
    ['> INDEXING RAG KNOWLEDGE BASE............. OK', '#4aaa88', false],
    ['> CONNECTING TO NOVA MODELS.............. OK', '#5ab898', false],
    ['> ALL SYSTEMS OPERATIONAL.', '#63b3ff', true],
];

export const SUGGESTIONS: Suggestion[] = [
    { text: 'Quelles sont tes expériences professionnelles ?', icon: '💼' },
    { text: 'Sur quels types de projets as-tu travaillé ?', icon: '🚀' },
    { text: 'Peux tu me parler de tes projets personnels en IA ?', icon: '🧠' },
    { text: 'Quelles technologies maîtrises tu le mieux ?', icon: '⚡' },
];

export const SKILLS: Skill[] = [
    { label: 'LLM', icon: <Sparkles size={10} />, color: '#63b3ff' },
    { label: 'RAG', icon: <Database size={10} />, color: '#93d0ff' },
    { label: 'Agents', icon: <Cpu size={10} />, color: '#b8e0ff' },
    { label: 'Fullstack', icon: <Globe size={10} />, color: '#63b3ff' },
];

export const SYSTEMS: System[] = [
    { label: 'LLM Core', ok: true },
    { label: 'RAG Index', ok: true },
    { label: 'Memory', ok: true },
];