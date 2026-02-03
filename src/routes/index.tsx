import { createFileRoute, Link } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    Upload,
    Play,
    Sparkles,
    ArrowLeft,
    ChevronRight,
    Share2,
    Download,
    Send,
    Plus,
    PlayCircle,
} from 'lucide-react';

export const Route = createFileRoute('/')({
    component: MinimalAIApp,
});

type FileType = 'pdf' | 'video' | 'audio';

interface UploadedFile {
    id: string;
    name: string;
    type: FileType;
    size: string;
    status: 'ready' | 'processing';
    summary: string;
    duration?: string;
    timestamps?: { time: string; topic: string; seconds: number }[];
}

function MinimalAIApp() {
    const [view, setView] = useState<'library' | 'workspace'>('library');
    const [activeFile, setActiveFile] = useState<UploadedFile | null>(null);

    const files: UploadedFile[] = [
        {
            id: '1',
            name: 'Strategy_Q4_2024.pdf',
            type: 'pdf',
            size: '1.2 MB',
            status: 'ready',
            summary:
                'A comprehensive guide to the Q4 strategic objectives, focusing on cloud infrastructure scaling and customer retention metrics.',
        },
        {
            id: '2',
            name: 'Town_Hall_Recording.mp4',
            type: 'video',
            size: '28.4 MB',
            status: 'ready',
            duration: '15:20',
            summary:
                'The monthly town hall session covering new hires, office expansion plans, and the quarterly performance awards.',
            timestamps: [
                { time: '02:15', topic: 'Performance Review', seconds: 135 },
                { time: '07:40', topic: 'Hiring Roadmap', seconds: 460 },
                { time: '12:10', topic: 'Closing Remarks', seconds: 730 },
            ],
        },
        {
            id: '3',
            name: 'User_Feedback_Session.wav',
            type: 'audio',
            size: '8.1 MB',
            status: 'ready',
            duration: '08:45',
            summary:
                'Raw feedback from beta users regarding the new mobile interface and gesture-based navigation controls.',
            timestamps: [
                { time: '01:05', topic: 'Gesture Issues', seconds: 65 },
                { time: '04:30', topic: 'Feature Requests', seconds: 270 },
            ],
        },
    ];

    const handleBack = () => {
        setView('library');
        setTimeout(() => setActiveFile(null), 400);
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans">
            <AnimatePresence mode="wait">
                {view === 'library' ? (
                    <LibraryView
                        key="library"
                        files={files}
                        onSelect={(f) => {
                            setActiveFile(f);
                            setView('workspace');
                        }}
                    />
                ) : (
                    <WorkspaceView key="workspace" file={activeFile!} onBack={handleBack} />
                )}
            </AnimatePresence>
        </div>
    );
}

// --- LIBRARY VIEW ---

function LibraryView({ files, onSelect }: { files: UploadedFile[]; onSelect: (f: UploadedFile) => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-5xl mx-auto px-8 py-24"
        >
            <header className="mb-20 flex justify-between items-end">
                <div className="space-y-4">
                    <h1 className="text-6xl font-normal tracking-tight">Nexus</h1>
                    <p className="text-zinc-500 font-medium text-lg max-w-md">
                        Intelligent interpretation for your documents, audio, and video.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="px-6 py-3 text-zinc-600 font-medium hover:text-zinc-900 transition-colors">
                        Sign In
                    </Link>
                    <button className="flex items-center gap-2 px-8 py-3 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-800 transition-all active:scale-95 shadow-sm">
                        <Plus size={20} />
                        <span>Upload</span>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                {files.map((file) => (
                    <motion.div
                        key={file.id}
                        onClick={() => onSelect(file)}
                        className="group cursor-pointer border-b border-zinc-100 pb-12 hover:border-zinc-300 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                                {file.type} &bull; {file.size}
                            </span>
                            <div className="h-2 w-2 rounded-full bg-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h2 className="text-3xl font-normal mb-4 group-hover:underline underline-offset-8 transition-all">
                            {file.name}
                        </h2>
                        <p className="text-zinc-500 text-sm leading-relaxed mb-6 line-clamp-2">{file.summary}</p>
                        <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
                            <span>Open Insight</span>
                            <ChevronRight size={14} />
                        </div>
                    </motion.div>
                ))}

                <div className="flex items-center justify-center p-12 border-2 border-dashed border-zinc-100 rounded-[40px] hover:bg-zinc-50 transition-colors cursor-pointer group">
                    <div className="text-center">
                        <div className="h-12 w-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Upload size={20} className="text-zinc-400" />
                        </div>
                        <p className="text-sm font-semibold text-zinc-400">Drag files here</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// --- WORKSPACE VIEW ---

function WorkspaceView({ file, onBack }: { file: UploadedFile; onBack: () => void }) {
    const [messages, setMessages] = useState([
        { role: 'ai', text: `Analysis of **${file.name}** complete. How can I help you navigate this content?` },
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { role: 'user', text: input }]);
        setInput('');
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'ai',
                    text: `According to the analysis, ${input} is mentioned in the core context. I've highlighted the most relevant segment for you.`,
                },
            ]);
        }, 800);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen flex flex-col bg-white"
        >
            {/* Minimal Header */}
            <header className="h-20 border-b border-zinc-100 px-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span>Back</span>
                    </button>
                    <div className="h-4 w-[1px] bg-zinc-200" />
                    <h2 className="text-sm font-semibold tracking-tight">{file.name}</h2>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
                        <Share2 size={18} />
                    </button>
                    <button className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
                        <Download size={18} />
                    </button>
                    <button className="px-6 py-2 bg-zinc-900 text-white text-xs font-bold rounded-full">
                        Share Results
                    </button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Information Rail */}
                <div className="w-[380px] border-r border-zinc-100 flex flex-col p-10 overflow-y-auto custom-scrollbar gap-12">
                    <section>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">
                            Summary
                        </h3>
                        <p className="text-zinc-600 text-sm leading-relaxed serif italic">"{file.summary}"</p>
                    </section>

                    {file.timestamps && (
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">
                                Key Chapters
                            </h3>
                            <div className="space-y-1">
                                {file.timestamps.map((ts, i) => (
                                    <button
                                        key={i}
                                        className="w-full text-left group flex items-center justify-between py-3 hover:px-2 rounded-lg transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <PlayCircle
                                                size={16}
                                                className="text-zinc-300 group-hover:text-zinc-900 transition-colors"
                                            />
                                            <span className="text-sm font-medium text-zinc-500 group-hover:text-zinc-900">
                                                {ts.topic}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-mono text-zinc-300 group-hover:text-zinc-500">
                                            {ts.time}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="mt-auto">
                        <div className="p-6 bg-zinc-50 rounded-[32px] border border-zinc-100">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                                Model Context
                            </h4>
                            <p className="text-xs text-zinc-500 leading-relaxed">
                                Analysis powered by Nexus Llama-3. Optimized for {file.type} content extraction.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Content Viewport */}
                <div className="flex-1 bg-zinc-50 flex flex-col p-12 overflow-hidden">
                    <div className="flex-1 bg-white border border-zinc-200 rounded-[48px] shadow-sm overflow-hidden relative flex flex-col items-center justify-center p-12">
                        {file.type === 'pdf' ? (
                            <div className="w-full max-w-2xl space-y-8 animate-pulse opacity-40">
                                <div className="h-6 w-1/3 bg-zinc-100 rounded animate-none" />
                                <div className="space-y-4">
                                    <div className="h-4 w-full bg-zinc-100 rounded" />
                                    <div className="h-4 w-full bg-zinc-100 rounded" />
                                    <div className="h-4 w-3/4 bg-zinc-100 rounded" />
                                </div>
                                <div className="h-64 w-full border border-zinc-100 rounded-3xl" />
                                <div className="space-y-4">
                                    <div className="h-4 w-full bg-zinc-100 rounded" />
                                    <div className="h-4 w-5/6 bg-zinc-100 rounded" />
                                </div>
                            </div>
                        ) : (
                            <div className="relative group">
                                <div className="absolute inset-0 bg-zinc-200 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="relative h-48 w-48 rounded-full bg-white border border-zinc-100 flex items-center justify-center shadow-sm">
                                    <Play size={40} className="text-zinc-900 ml-2" fill="currentColor" />
                                </div>
                                <div className="mt-12 space-y-4 text-center">
                                    <h4 className="text-xl font-normal">Ready to play</h4>
                                    <p className="text-sm text-zinc-400">Total duration: {file.duration}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Console */}
                <div className="w-[480px] border-l border-zinc-100 flex flex-col p-10">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-10 w-10 bg-zinc-900 rounded-full flex items-center justify-center">
                            <Sparkles className="text-white" size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold">Nexus AI</h3>
                            <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                                Assistant Interface
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-10 mb-8">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`
                                    max-w-[90%] text-sm leading-relaxed p-6 rounded-[32px]
                                    ${m.role === 'user' ? 'bg-zinc-100 text-zinc-900 rounded-tr-none' : 'bg-white border border-zinc-100 text-zinc-600 rounded-tl-none'}
                                `}
                                >
                                    {m.text}
                                </div>
                                <span className="text-[9px] font-bold text-zinc-300 mt-2 px-2 uppercase tracking-widest">
                                    {m.role === 'ai' ? 'Nexus' : 'User'}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask a question..."
                            className="w-full h-16 bg-zinc-50 border border-zinc-100 rounded-full px-8 text-sm outline-none focus:border-zinc-300 transition-all font-medium"
                        />
                        <button
                            onClick={handleSend}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 bg-zinc-900 text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </main>
        </motion.div>
    );
}
