'use client';

import { ChevronDown } from 'lucide-react';
import { AgentSettingsPanel } from '@/components/agent/agent-settings-panel';
import { AGENT_SETTINGS_FAQS } from '@/lib/agent-settings-faqs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/components/ui/utils';

export function AgentSettingsFaqsPanel() {
  return (
    <AgentSettingsPanel title="FAQs" backHref="/agent/settings">
      <Accordion type="single" collapsible defaultValue="faq-0" className="space-y-3">
        {AGENT_SETTINGS_FAQS.map((faq, index) => (
          <AccordionItem
            key={faq.question}
            value={`faq-${index}`}
            className={cn(
              'overflow-hidden rounded-2xl border border-[#ece8f2] bg-white px-4 shadow-sm',
              'border-b border-[#ece8f2] last:border-b',
            )}
          >
            <AccordionTrigger className="py-4 text-[15px] font-semibold text-[#1F2A24] hover:no-underline [&>svg]:hidden">
              <span className="pr-4 text-left">{faq.question}</span>
              <ChevronDown className="h-5 w-5 shrink-0 text-[#9ca3af] transition-transform [[data-state=open]_&]:rotate-180" />
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-sm leading-relaxed text-[#6b7280]">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </AgentSettingsPanel>
  );
}
