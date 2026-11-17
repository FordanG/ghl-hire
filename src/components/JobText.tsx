/**
 * Renders plain-text job copy: blank lines split paragraphs, and runs of
 * lines starting with "-", "*" or "•" become a list.
 */
export default function JobText({ text }: { text: string }) {
  const blocks: { type: 'p' | 'ul'; lines: string[] }[] = [];
  const bullet = /^\s*(?:[-*•]|\d+[.)])\s+/;

  for (const raw of text.replace(/\r/g, '').split('\n')) {
    const line = raw.trim();
    const last = blocks[blocks.length - 1];
    if (!line) {
      blocks.push({ type: 'p', lines: [] });
      continue;
    }
    if (bullet.test(line)) {
      const item = line.replace(bullet, '');
      if (last?.type === 'ul') last.lines.push(item);
      else blocks.push({ type: 'ul', lines: [item] });
    } else if (last?.type === 'p') {
      last.lines.push(line);
    } else {
      blocks.push({ type: 'p', lines: [line] });
    }
  }

  return (
    <div className="space-y-4 text-[17px] leading-[1.7] text-ink-soft">
      {blocks
        .filter((block) => block.lines.length > 0)
        .map((block, index) =>
          block.type === 'ul' ? (
            <ul key={index} className="list-disc space-y-1.5 pl-6 marker:text-brand">
              {block.lines.map((line, lineIndex) => (
                <li key={lineIndex}>{line}</li>
              ))}
            </ul>
          ) : (
            <p key={index} className="whitespace-pre-line">{block.lines.join('\n')}</p>
          )
        )}
    </div>
  );
}
