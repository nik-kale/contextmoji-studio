
import React from 'react';
import { CheckIcon, SparklesIcon, KeyIcon } from '@heroicons/react/24/outline';

interface PricingViewProps {
  onBack: () => void;
}

const PricingView: React.FC<PricingViewProps> = ({ onBack }) => {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for casual posters.',
      features: ['5 Visual Credits / Mo', 'Unlimited Emoji Analysis', '1K Resolution Only', 'Standard Palettes'],
      button: 'Current Plan',
      isCurrent: true
    },
    {
      name: 'Pro',
      price: '$19',
      description: 'For content creators & creators.',
      features: ['Unlimited Credits', '4K High Res Generation', 'Custom Brand Mode', 'Hex Color Matching', 'Advanced Rewrites'],
      button: 'Upgrade to Pro',
      isPro: true
    },
    {
      name: 'Power User (BYOK)',
      price: '$0',
      description: 'Bring Your Own API Key.',
      features: ['Unlimited usage', 'No platform markup', 'You pay Google direct', 'All Pro features unlocked'],
      button: 'Link API Key',
      isBYOK: true
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight mb-4">Precision pricing for precision writers.</h2>
        <p className="text-zinc-500 max-w-xl mx-auto">Scale your social impact with AI-driven visuals and emoji strategies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <div key={tier.name} className={`bg-white border p-8 rounded-2xl flex flex-col ${tier.isPro ? 'border-zinc-900 shadow-2xl relative' : 'border-zinc-200'}`}>
            {tier.isPro && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                Recommended
              </div>
            )}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="text-zinc-400 text-sm">/ month</span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">{tier.description}</p>
            </div>

            <ul className="space-y-4 mb-12 flex-1">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-3 text-sm text-zinc-600">
                  <CheckIcon className="w-5 h-5 text-zinc-900 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <button 
              onClick={tier.isBYOK ? () => (window as any).aistudio.openSelectKey() : undefined}
              className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${
                tier.isPro ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
              }`}
            >
              {tier.button}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center p-12 bg-zinc-50 rounded-3xl border border-zinc-100">
        <h4 className="font-bold text-lg mb-2">How do API Keys work?</h4>
        <p className="text-zinc-500 text-sm max-w-2xl mx-auto leading-relaxed">
          If you use your own Google Gemini API Key, Contextmoji doesn't charge you for credits. You'll be billed directly by Google Cloud at their standard rates (approx. $0.0001 per generation). This is the most cost-effective way for heavy users.
        </p>
      </div>
    </div>
  );
};

export default PricingView;
