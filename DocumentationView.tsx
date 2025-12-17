import React from 'react';
import { ChevronLeftIcon, BoltIcon, CurrencyDollarIcon, BookOpenIcon, InformationCircleIcon, PuzzlePieceIcon, PaintBrushIcon, KeyIcon } from '@heroicons/react/24/outline';

interface DocumentationViewProps {
  onBack: () => void;
}

const DocumentationView: React.FC<DocumentationViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="max-w-5xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-6 duration-600">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-zinc-400 hover:text-zinc-900 transition-colors mb-16 font-black text-xs uppercase tracking-[0.2em]"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Back to Workstation
        </button>

        <header className="mb-24 border-b border-zinc-100 pb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-xl">
              <PuzzlePieceIcon className="w-7 h-7 text-white" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.6em] text-zinc-300 leading-none">System Intelligence</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-zinc-900 mb-8 leading-[0.9]">Master Specification</h1>
          <p className="text-2xl text-zinc-500 font-medium max-w-2xl leading-relaxed">Operating parameters and ecosystem integration guides for v2.5.5.</p>
        </header>
        
        <div className="space-y-32">
          {/* Section 01 */}
          <section>
            <div className="flex items-center gap-4 mb-10">
                <div className="px-5 py-2 bg-zinc-900 text-white text-[11px] font-black rounded-xl">01</div>
                <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tight">Ecosystem Intelligence</h2>
            </div>
            <p className="text-zinc-600 text-xl leading-relaxed mb-12 font-medium max-w-3xl">
              Contextmoji Studio utilizes high-dimensional semantic analysis to adapt tone. Unlike legacy emoji tools, our engine analyzes <strong className="text-zinc-900">intent</strong>, <strong className="text-zinc-900">platform culture</strong>, and <strong className="text-zinc-900">target density</strong> to ensure your message lands with precision.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-10 bg-zinc-50 border border-zinc-100 rounded-[3rem] shadow-sm">
                  <h4 className="font-black text-xs text-zinc-900 uppercase tracking-widest mb-4">Text Density Modulation</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed font-medium">Concise modes target short-form platforms like BlueSky and Threads. Detailed modes favor LinkedIn and long-form listicles.</p>
               </div>
               <div className="p-10 bg-zinc-50 border border-zinc-100 rounded-[3rem] shadow-sm">
                  <h4 className="font-black text-xs text-zinc-900 uppercase tracking-widest mb-4">Emoji Semantics</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed font-medium">Our models identify 'Signal vs Noise'. Emojis are treated as semantic markers to improve scanning readability, not just decorative flair.</p>
               </div>
            </div>
          </section>

          {/* Section 02 */}
          <section>
            <div className="flex items-center gap-4 mb-10">
                <div className="px-5 py-2 bg-zinc-900 text-white text-[11px] font-black rounded-xl">02</div>
                <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tight">Visual Rendering</h2>
            </div>
            <p className="text-zinc-600 text-xl leading-relaxed mb-12 font-medium max-w-3xl">
              The Visual Studio leverages <strong className="text-zinc-900">Gemini-3-Pro-Image-Preview</strong> for high-fidelity asset generation.
            </p>
            <div className="space-y-6">
                <div className="flex gap-8 p-10 bg-zinc-50 rounded-[3rem] border border-zinc-100 group hover:bg-zinc-100 transition-colors">
                  <BoltIcon className="w-12 h-12 text-zinc-900 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-black text-xs text-zinc-900 uppercase tracking-widest mb-3">Multi-Variation Pipeline</h4>
                    <p className="text-sm text-zinc-500 leading-relaxed font-medium">Every render triggers a 3-variant exploration. This allows users to select the composition that best fits their brand narrative.</p>
                  </div>
                </div>
                <div className="flex gap-8 p-10 bg-zinc-50 rounded-[3rem] border border-zinc-100 group hover:bg-zinc-100 transition-colors">
                  <PaintBrushIcon className="w-12 h-12 text-zinc-900 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-black text-xs text-zinc-900 uppercase tracking-widest mb-3">Brand Integrity Mode</h4>
                    <p className="text-sm text-zinc-500 leading-relaxed font-medium">Injection of explicit Hex parameters ensures the AI adheres to your corporate style guide during pixel generation.</p>
                  </div>
                </div>
            </div>
          </section>

          {/* Section 03 */}
          <section className="pb-32 border-b border-zinc-100">
            <div className="flex items-center gap-4 mb-10">
                <div className="px-5 py-2 bg-zinc-900 text-white text-[11px] font-black rounded-xl">03</div>
                <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tight">Billing & BYOK</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="p-8 bg-zinc-900 text-white rounded-[2.5rem] shadow-2xl">
                  <CurrencyDollarIcon className="w-10 h-10 mb-6" />
                  <h4 className="text-lg font-black uppercase tracking-tight mb-2">Platform Credits</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed font-medium">Standard accounts receive monthly allocations. Renders are metered based on resolution and model depth.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-8 bg-white border border-zinc-200 rounded-[2.5rem] shadow-sm">
                  <KeyIcon className="w-10 h-10 text-zinc-900 mb-6" />
                  <h4 className="text-lg font-black uppercase tracking-tight mb-2">BYOK Protocol</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed font-medium">Integrate your personal API key to bypass platform metering. All Pro features are unlocked as a courtesy for using external compute.</p>
                </div>
              </div>
            </div>
          </section>

          <footer className="text-center py-10">
            <p className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.6em]">Contextmoji Studio Architecture &middot; Nik Kale &middot; MMXXVI</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DocumentationView;