import React from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

interface DocumentationViewProps {
  onBack: () => void;
}

const DocumentationView: React.FC<DocumentationViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-8 font-medium text-sm"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        Back to App
      </button>

      <article className="prose prose-zinc max-w-none">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Contextmoji Documentation</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-zinc-600 leading-relaxed mb-4">
            Contextmoji is a tone-aware emoji insertion system for social posts. It leverages AI to understand the semantic intent of your content and suggests emojis that enhance rather than detract from your professional presence.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600">
            <li>Generate high-quality emoji suggestions based on intent + content</li>
            <li>Automatically insert emojis without damaging readability</li>
            <li>Produce rewritten versions that unlock better emoji placement</li>
            <li>Adapt output to platform norms (LinkedIn vs X vs Threads vs Bluesky)</li>
          </ul>
        </section>

        <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-white border border-zinc-200 rounded-xl">
            <h3 className="font-bold mb-2">Platform Logic</h3>
            <p className="text-sm text-zinc-500">
              Appropriateness varies by platform. LinkedIn favors high-signal professional markers, while X rewards high-energy, trending icons.
            </p>
          </div>
          <div className="p-6 bg-white border border-zinc-200 rounded-xl">
            <h3 className="font-bold mb-2">Emoji Density</h3>
            <p className="text-sm text-zinc-500">
              Control your "budget" with the precision slider. From minimalist one-emoji accents to high-engagement creator strings.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Core Principles</h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-zinc-900">1. Intent Detection</h4>
              <p className="text-zinc-600 text-sm">Contextmoji infers the post’s intent (e.g., product update, hiring, opinion) before picking emojis.</p>
            </div>
            <div>
              <h4 className="font-bold text-zinc-900">2. Topic Detection</h4>
              <p className="text-zinc-600 text-sm">Topics like Security (🛡️), AI (🧠), or Performance (📈) trigger specialized emoji sets.</p>
            </div>
            <div>
              <h4 className="font-bold text-zinc-900">3. Readability Rules</h4>
              <p className="text-zinc-600 text-sm">Emojis are placed at clause ends or as list prefixes to ensure accessibility and flow.</p>
            </div>
          </div>
        </section>

        <footer className="pt-12 border-t border-zinc-100 text-zinc-400 text-xs">
          Built for precision copywriters by Nik Kale. 2026.
        </footer>
      </article>
    </div>
  );
};

export default DocumentationView;