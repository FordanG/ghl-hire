import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';

const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;

/** Renders the two inline markers articles may use: **bold** and [label](url). */
export default function RichText({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter((part) => part !== '');
  return (
    <>
      {parts.map((part, index): ReactNode => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (link) {
          const [, label, href] = link;
          if (href.startsWith('/')) {
            return <Link key={index} href={href}>{label}</Link>;
          }
          return (
            <a key={index} href={href} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}
