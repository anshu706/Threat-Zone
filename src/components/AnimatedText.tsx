import React from 'react';

type AnimatedTextTag = 'h1' | 'h2' | 'h3' | 'p' | 'span';

interface AnimatedTextProps {
  text: string;
  as?: AnimatedTextTag;
  className?: string;
  by?: 'words' | 'chars';
  shimmer?: boolean;
  /** Base delay before first character/word animates (seconds) */
  delay?: number;
  /** Seconds between each word/char */
  stagger?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  as: Tag = 'span',
  className = '',
  by = 'words',
  shimmer = false,
  delay = 0,
  stagger = 0.055,
}) => {
  const parts = by === 'chars' ? [...text] : text.split(' ').filter(Boolean);
  const composedClass = [className, shimmer ? 'tz-display-shimmer' : ''].filter(Boolean).join(' ');

  return (
    <Tag className={composedClass || undefined} aria-label={text}>
      {parts.map((part, i) => (
        <span
          key={`${part}-${i}`}
          className={by === 'chars' ? 'tz-reveal-char' : 'tz-reveal-word'}
          style={{ animationDelay: `${delay + i * stagger}s` }}
          aria-hidden="true"
        >
          {by === 'chars' ? part : part}
        </span>
      ))}
    </Tag>
  );
};
