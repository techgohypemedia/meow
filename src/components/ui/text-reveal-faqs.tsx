'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'
import { motion } from "framer-motion";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQsProps {
  title?: string;
  subtitle?: string;
  supportText?: string;
  supportLinkText?: string;
  supportLinkHref?: string;
  items?: FAQItem[];
  className?: string;
}

const DEFAULT_FAQ_ITEMS: FAQItem[] = [
  {
    id: 'item-1',
    question: 'What is Ruixen UI?',
    answer: 'Ruixen UI is a modern, fully responsive design system that provides pre-built components, utilities, and layouts to help developers build scalable web applications quickly and efficiently.',
  },
  {
    id: 'item-2',
    question: 'Which platforms does Ruixen UI support?',
    answer: 'Ruixen UI is built for web applications and works seamlessly with React, Next.js, and other modern JavaScript frameworks. It also supports dark mode and responsive layouts out of the box.',
  },
  {
    id: 'item-3',
    question: 'Can I customize Ruixen UI components?',
    answer: 'Yes! All Ruixen UI components are fully customizable via props, CSS classes, and theme configuration. You can easily adapt colors, spacing, typography, and layout to match your brand.',
  },
  {
    id: 'item-4',
    question: 'Does Ruixen UI provide integration with third-party tools?',
    answer: 'Absolutely. Ruixen UI includes ready-to-use integrations and patterns for popular tools and services, making it easier to connect your application with analytics, authentication, and workflow platforms.',
  },
  {
    id: 'item-5',
    question: 'Is there documentation and support available?',
    answer: 'Yes, Ruixen UI comes with comprehensive documentation, live examples, and tutorials. Additionally, our community and support channels are available to help you implement components and resolve any issues.',
  },
];

export default function FAQs({
  title = "FAQs",
  subtitle = "Everything you need to know about Ruixen UI",
  supportText = "Can’t find what you’re looking for? Reach out to our",
  supportLinkText = "Ruixen UI support team",
  supportLinkHref = "#",
  items = DEFAULT_FAQ_ITEMS,
  className = "",
}: FAQsProps = {}) {
  return (
    <section className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 ${className}`}>
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 md:grid-cols-5 md:gap-12 items-start">
          {/* Left / Header Column */}
          <div className="md:col-span-2 md:sticky md:top-28">
            {/* Cute Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 bg-[#D1F0E4] text-brand-black px-3.5 py-1.5 rounded-full border-2 border-brand-black shadow-[2px_2px_0px_#111111] font-heading font-black text-xs uppercase tracking-wider mb-3">
              <span>🐾</span>
              <span>Got Questions?</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-heading font-black text-brand-black tracking-tight leading-[1.15]">
              {title}
            </h2>
            <p className="text-brand-black/75 mt-2.5 sm:mt-3 text-sm sm:text-base leading-relaxed font-medium">
              {subtitle}
            </p>

            {/* Desktop Support Card */}
            <div className="hidden md:flex mt-8 p-5 rounded-2xl bg-brand-blue-light/50 border-2 border-brand-black shadow-[3px_3px_0px_#111111] flex-col gap-3">
              <div>
                <p className="font-heading font-bold text-sm text-brand-black flex items-center gap-1.5">
                  <span>💬</span>
                  <span>{supportText}</span>
                </p>
                <p className="text-xs text-brand-black/70 font-medium mt-1">
                  Our feline care team answers questions 7 days a week.
                </p>
              </div>
              <Link
                href={supportLinkHref}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-black text-brand-white rounded-full font-heading font-bold text-xs shadow-[2px_2px_0px_#A9D3F4] hover:scale-105 active:scale-95 transition-transform text-center"
              >
                <span>{supportLinkText}</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right / Accordion Column */}
          <div className="md:col-span-3">
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-3 sm:space-y-3.5"
            >
              {items.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="rounded-2xl border-2 border-brand-black bg-brand-white shadow-[2px_2px_0px_#111111] sm:shadow-[3px_3px_0px_#111111] overflow-hidden transition-all duration-200 data-[state=open]:bg-brand-blue-light/25 data-[state=open]:shadow-[4px_4px_0px_#111111] data-[state=open]:-translate-y-0.5"
                >
                  <AccordionTrigger className="cursor-pointer px-4 sm:px-6 py-3.5 sm:py-4.5 hover:no-underline text-left flex items-center justify-between gap-3 group w-full">
                    <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0 pr-2">
                      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-brand-blue/30 text-brand-black font-heading font-black text-xs sm:text-sm flex items-center justify-center shrink-0 border border-brand-black/20 group-hover:bg-brand-blue group-hover:scale-105 transition-all">
                        {index + 1}
                      </span>
                      <span className="font-heading font-bold text-sm sm:text-base md:text-lg text-brand-black leading-snug">
                        {item.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-5 pt-0 text-brand-black/85 font-medium">
                    <div className="pt-2 border-t border-brand-black/10">
                      <BlurredStagger text={item.answer} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Mobile Support Card (Tactile, visible on mobile screens) */}
            <div className="md:hidden mt-6 p-4 rounded-2xl bg-brand-blue-light/50 border-2 border-brand-black shadow-[3px_3px_0px_#111111] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="font-heading font-bold text-sm text-brand-black flex items-center gap-1.5">
                  <span>💬</span>
                  <span>{supportText}</span>
                </p>
                <p className="text-xs text-brand-black/70 font-medium mt-0.5">
                  Our feline care team is always here to help.
                </p>
              </div>
              <Link
                href={supportLinkHref}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-black text-brand-white rounded-full font-heading font-bold text-xs shadow-[2px_2px_0px_#A9D3F4] hover:scale-105 active:scale-95 transition-transform w-full sm:w-auto text-center"
              >
                <span>{supportLinkText}</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export const BlurredStagger = ({
  text = "built by ruixen.com",
}: {
  text: string;
}) => {
  const words = text.split(" ");
 
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
      },
    },
  };
 
  const wordAnimation = {
    hidden: {
      opacity: 0,
      filter: "blur(6px)",
      y: 4,
    },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
    },
  };
 
  return (
    <div className="w-full">
      <motion.p
        variants={container}
        initial="hidden"
        animate="show"
        className="text-xs sm:text-sm md:text-base leading-relaxed font-medium text-brand-black/85 flex flex-wrap gap-x-1.5 gap-y-1"
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={wordAnimation}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="inline-block"
          >
            {word}
          </motion.span>
        ))}
      </motion.p>
    </div>
  );
};
