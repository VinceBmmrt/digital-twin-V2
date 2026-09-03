import { Sparkles, Cpu, Database, Globe, Bot, Code2, Boxes } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Suggestion, Skill, System } from '../types/types';

export interface BentoItem {
    area: 'a' | 'b' | 'c' | 'd' | 'f';
    icon?: ReactNode;
    title?: string;
    body?: string;
    tags?: string[];
    featured?: boolean;
}

export const BENTO_ITEMS: BentoItem[] = [
    {
        area: 'a',
        featured: true,
        icon: <Bot size={18} />,
        title: 'Systèmes Multi-Agents',
        body: "Orchestration de graphes d'agents avec LangGraph : gestion des états, routage conditionnel, parallélisation des tâches. Agents spécialisés pour le sourcing, le matching et la prise de rendez-vous, déployés en production.",
        tags: ['LangGraph', 'CrewAI', 'OpenAI Agents SDK', 'n8n'],
    },
    {
        area: 'b',
        icon: <Cpu size={18} />,
        title: 'Robotique & Computer Vision',
        body: "Architecture IA reliant ROS2, vision par ordinateur et LLM sur un robot humanoïde Unitree G1 : navigation autonome, YOLO, téléopération VR.",
        tags: ['ROS2', 'Nav2', 'YOLO', 'Unitree SDK'],
    },
    {
        area: 'c',
        icon: <Database size={18} />,
        title: 'RAG & Fine-tuning',
        body: 'Vectorisation sémantique, reranking, LoRA/QLoRA.',
        tags: ['RAG', 'QLoRA'],
    },
    {
        area: 'd',
        icon: <Code2 size={18} />,
        title: 'Fullstack Production',
        body: 'React, Next.js, Node.js, Java Spring.',
        tags: ['Next.js', 'Spring'],
    },
    {
        area: 'f',
        icon: <Boxes size={18} />,
        title: 'Stack IA',
        body: 'Hugging Face, Ollama, MCP Servers, Vector DBs.',
        tags: ['Hugging Face', 'Ollama', 'MCP', 'ChromaDB'],
    },
];

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