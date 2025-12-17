
import React from 'react';
import { ChevronLeftIcon, BoltIcon, CurrencyDollarIcon, CubeTransparentIcon } from '@heroicons/react/24/outline';

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
        <h1 className="text-4xl font-bold tracking-tight mb-8">Contextmoji Studio System Manual</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            < BoltIcon className="w-6 h-6 text-zinc-900" />
            Visual Variations Engine
          </h2>
          <p className="text-zinc-600 leading-relaxed mb-4">
            Contextmoji Studio doesn't just generate one image. Our engine spins up multiple concurrent variations (up to 5) per request. Each variation explores different compositions within your chosen <strong>Style</strong> and <strong>Palette</strong>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
             <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                <h4 className="font-bold text-sm mb-1">Aspect Ratios</h4>
                <p className="text-xs text-zinc-500">Choose 9:16 for Threads/Stories, 16:9 for X/LinkedIn, or 1:1 for generic posts.</p>
             </div>
             <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                <h4 className="font-bold text-sm mb-1">Brand Mode</h4>
                <p className="text-xs text-zinc-500">Signed-in users can lock their Hex color code to ensure every generated visual matches their brand identity.</p>
             </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CurrencyDollarIcon className="w-6 h-6 text-zinc-900" />
            Hybrid Billing Model
          </h2>
          <p className="text-zinc-600 leading-relaxed mb-4">
            We provide three ways to power your content generation:
          </p>
          <ul className="list-none pl-0 space-y-4">
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">1</div>
              <div>
                <strong className="block text-zinc-900">Platform Credits</strong>
                <span className="text-sm text-zinc-500">Free users get 10 monthly credits. Pro users get unlimited platform-hosted generations.</span>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">2</div>
              <div>
                <strong className="block text-zinc-900">Bring Your Own Key (BYOK)</strong>
                <span className="text-sm text-zinc-500">Link your Google Gemini API Key. This bypasses our credits entirely. You pay Google directly at cost, and Contextmoji Studio unlocks all Pro features for free.</span>
              </div>
            </li>
          </ul>
        </section>

        <footer className="pt-12 border-t border-zinc-100 text-zinc-400 text-xs">
          Built for precision copywriters by Nik Kale. 2026.
        </footer>
      </article>
    </div>
  );
};

export default DocumentationView;