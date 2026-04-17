import React, { useState } from 'react';
import { Icon } from './Icon';

const FAQS = [
  { q: 'Are my files secure?', a: 'Yes! Our unique AI PDF tools ensure your data is protected. Many runs securely in your browser and files never leave your device. AI features use encrypted channels.' },
  { q: 'Is this service free to use?', a: 'Yes. PDFSala is a free-to-use platform. We strive to provide premium-level tools like a secure PDF merger and AI summarizer at no cost to you.' },
  { q: 'Do I need to install any software?', a: 'No! Everything runs directly in your web browser. You do not need to download or install any software.' },
  { q: 'What is the maximum file size allowed?', a: 'Currently, the maximum file size is usually 10MB to 50MB depending on the specific tool you are using. AI tools generally have stricter limits.' },
  { q: 'Can I use these tools on my mobile device?', a: 'Yes! Our website is fully responsive and works perfectly on your phone or tablet browser.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div id="faq" className="max-w-[50rem] mx-auto px-4 py-8 pb-32">
      <div className="text-center mb-10">
        <h2 className="text-[2.2rem] font-bold text-white mb-3 tracking-tight">Frequently Asked Questions</h2>
        <p className="text-[1.1rem] text-slate-400">Got questions? We've got answers.</p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <div key={i} className="border border-slate-700/50 rounded-xl bg-[#1e293b] overflow-hidden">
            <button 
              onClick={() => toggle(i)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700/80 transition-colors"
            >
              <span className="text-[1.1rem] font-bold text-white">{faq.q}</span>
              <Icon name={openIndex === i ? 'ChevronUp' : 'ChevronDown'} className="w-5 h-5 text-slate-400 flex-shrink-0 ml-4" />
            </button>
            {openIndex === i && (
              <div className="px-6 pb-5 pt-1 text-slate-400 text-[1rem] leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
