import React, { useMemo } from 'react';
import './nextjsshop-button.css';

type Variant = 'primary' | 'secondary';

/* The wipe colours per variant. Primary starts indigo and wipes to ink;
   secondary starts as the paper chip and wipes to indigo. */
const VARIANTS: Record<Variant, React.CSSProperties> = {
    primary: {
        '--b01-bg': '#4338E5',
        '--b01-fg': '#ffffff',
        '--b01-fill': '#16161C',
        '--b01-fill-fg': '#ffffff',
    } as React.CSSProperties,
    secondary: {
        '--b01-bg': '#FAFAFB',
        '--b01-fg': '#1A1A21',
        '--b01-fill': '#4338E5',
        '--b01-fill-fg': '#ffffff',
        '--b01-ring': '#E5E7EB',
        '--b01-ring-w': '1px',
        '--b01-size': '0.85rem',
        '--b01-weight': '500',
    } as React.CSSProperties,
};

/* Random once per mount, not per render: Auth re-renders on every keystroke and
   fresh indexes there would restart the transitions mid-hover. */
const randomIndexes = (count: number, base: number) =>
    Array.from({ length: count }, () => base + Math.floor(Math.random() * 4));

/* Compact inline size for card actions — shorter, auto-width, smaller pixels so
   the dither edge still reads at 28px tall. */
const SM: React.CSSProperties = {
    '--b01-h': '1.65rem',
    '--b01-w': 'auto',
    '--b01-px': '0.3rem',
    '--b01-size': '0.6rem',
} as React.CSSProperties;

interface Button01Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    variant?: Variant;
    size?: 'md' | 'sm';
}

export const Button01 = ({ label, variant = 'primary', size = 'md', className = '', style, ...rest }: Button01Props) => {
    const edge = useMemo(() => randomIndexes(25, 0), []);
    const scatter = useMemo(() => randomIndexes(11, 4), []);

    return (
        <button {...rest} className={`button01 ${className}`}
            style={{ ...VARIANTS[variant], ...(size === 'sm' ? SM : null), ...style }}>
            <span className="button01_bg" aria-hidden="true">
                <span className="button01_bg-mid"></span>
                <span className="button01_bg-right">
                    {edge.map((index, i) => (
                        <span key={`pixel-${i}`} style={{ '--index': index } as React.CSSProperties}
                            className="button01_bg-pixel"></span>
                    ))}
                </span>
                <span className="button01_bg-right-overlay">
                    {scatter.map((index, i) => (
                        <span key={`overlay-${i}`} style={{ '--index': index } as React.CSSProperties}
                            className="button01_bg-pixel"></span>
                    ))}
                </span>
            </span>
            <span data-text={label} className="button01_inner">
                <span className="button01_text">{label}</span>
            </span>
        </button>
    );
};
