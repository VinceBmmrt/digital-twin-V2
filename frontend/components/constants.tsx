import { Cpu, Database, Bot, Code2, ShieldCheck, Mic, Sparkles, Globe } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Suggestion, Skill, System } from '../types/types';

export interface BentoItem {
    area: 'a' | 'b' | 'c' | 'd' | 'e' | 'f';
    color: string;
    icon?: ReactNode;
    title?: string;
    body: string[];
    highlights?: string[];
    tags?: string[];
}

export const BENTO_ITEMS: BentoItem[] = [
    {
        area: 'a',
        color: '#63b3ff',
        icon: <Bot size={18} />,
        title: 'Systèmes Multi-Agents',
        body: [
            "Orchestration de graphes d'agents avec LangGraph : gestion des états, routage conditionnel, parallélisation des tâches.",
            'Système déployé en production, traitant chaque jour des dizaines de candidatures là où tout était fait manuellement.',
        ],
        highlights: [
            'Gestion des états & routage conditionnel',
            'RAG avancé avec reranking contextuel',
            'Parallélisation des tâches à grande échelle',
        ],
        tags: ['LangGraph', 'CrewAI', 'OpenAI Agents SDK', 'n8n'],
    },
    {
        area: 'f',
        color: '#38bdf8',
        icon: <ShieldCheck size={18} />,
        title: 'Automatisation RH & Sécurité',
        body: [
            "Écosystème d'agents pour automatiser le cycle RH de bout en bout : lecture et analyse de CV, sourcing dans le secteur médical.",
            'Vérification des habilitations des agents de sécurité aéroportuaire et prise de rendez-vous automatisée.',
        ],
        tags: ['Analyse de CV', 'Sourcing médical', 'Vérification badges'],
    },
    {
        area: 'b',
        color: '#818cf8',
        icon: <Cpu size={18} />,
        title: 'Robotique & Computer Vision',
        body: [
            'Architecture IA reliant ROS2, cartographie LIDAR (RViz2) et navigation autonome (Nav2) sur un robot humanoïde Unitree G1.',
            'Détection de chute et de feu par un modèle YOLO entraîné sur mesure, téléopération immersive en réalité étendue (XR) avec suivi des mains.',
        ],
        tags: ['ROS2', 'Nav2', 'RViz2', 'YOLO'],
    },
    {
        area: 'c',
        color: '#22d3ee',
        icon: <Database size={18} />,
        title: 'RAG & Fine-tuning',
        body: [
            'RAG avancé (chunking optimisé, reranking contextuel) déployé en production.',
            'Fine-tuning local avec Ollama et sur Modal (Llama 3.2) pour estimer la valeur de 800 000 produits Amazon à partir de leur description.',
        ],
        tags: ['RAG', 'QLoRA', 'Ollama', 'Modal'],
    },
    {
        area: 'd',
        color: '#a78bfa',
        icon: <Code2 size={18} />,
        title: 'Fullstack Production',
        body: [
            'Application de planification des travaux ferroviaires pour un acteur du transport.',
            'Plateforme de mise en relation hôtels/personnel, avec un score Lighthouse porté de ~65 à ~90.',
        ],
        tags: ['Next.js', 'Spring'],
    },
    {
        area: 'e',
        color: '#22d3ee',
        icon: <Mic size={18} />,
        title: 'Agents Vocaux & Multimodaux',
        body: [
            'Agents vocaux (TTS/STT) pour la communication interne et la qualification téléphonique.',
            'Reconnaissance faciale et interactions vocales multilingues embarquées sur le robot Unitree G1.',
        ],
        tags: ['TTS', 'STT', 'Reconnaissance faciale', 'Voix multilingue'],
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

export interface VectorCluster {
    name: string;
    color: string;
    points: string[];
}

export const VECTOR_CLUSTERS: VectorCluster[] = [
    { name: 'Agents IA', color: '#60a5fa', points: ['LangGraph', 'CrewAI', 'Multi-agents', 'n8n', 'OpenAI SDK'] },
    { name: 'Automatisation RH & Sécurité', color: '#38bdf8', points: ['Analyse de CV', 'Sourcing médical', 'Vérification badges', 'Prise de RDV'] },
    { name: 'Agents Vocaux', color: '#22d3ee', points: ['TTS', 'STT', 'Voix multilingue'] },
    { name: 'RAG & LLM', color: '#2dd4bf', points: ['RAG', 'Fine-tuning', 'LoRA', 'QLoRA', 'Ollama'] },
    { name: 'Robotique & XR', color: '#818cf8', points: ['ROS2', 'Nav2', 'RViz2', 'LIDAR', 'YOLO', 'Reconnaissance faciale', 'Téléopération XR'] },
    { name: 'Frontend', color: '#a78bfa', points: ['React', 'Next.js', 'TypeScript', 'Redux'] },
    { name: 'Backend', color: '#c084fc', points: ['Node.js', 'Spring Boot', 'FastAPI', 'Express'] },
    { name: 'Cloud & MLOps', color: '#e879f9', points: ['AWS', 'Docker', 'Bedrock', 'Modal'] },
    { name: 'Machine Learning', color: '#f472b6', points: ['PyTorch', 'NumPy', 'Pandas', 'W&B'] },
    { name: 'Bases de données', color: '#67e8f9', points: ['PostgreSQL', 'MongoDB', 'ChromaDB', 'Supabase Vector'] },
    { name: 'Tests & Qualité', color: '#93c5fd', points: ['Jest', 'Pytest', 'Playwright', 'Cypress'] },
];