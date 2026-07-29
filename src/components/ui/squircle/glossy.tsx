// The glossy porcelain squircle thumb, from the "Apple's corners" parts.tsx.
// Only GlossySquircle is ported — the segmented control uses brand logos, so the
// debossed InkLabel and the other six demos aren't needed here.
//
// It's a stack of ~17 very low-opacity greyscale layers, each clipped to the
// squircle so it follows the corner rather than a plain rounded rect:
//   surface: porcelain gradient · corner vignette · centre glow · fine grain ·
//            brushed streaks · diagonal light sweep · middle sheen band
//   light:   side edge-lights · top sheen · glass rim · bottom counter-sheen ·
//            light lift · grounding shadow
//   edge:    tri-stop bevel border · inner shadow wall · fresnel edge-brighten ·
//            ambient-occlusion ring · corner glints · double outer hairline

import { useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { squirclePath, shapePath } from "./superellipse";

export interface Shape {
  radius: number;
  smoothing: number;
  exponent?: number;
}

export function GlossySquircle({
  w,
  h,
  radius,
  smoothing,
  exponent,
  children,
  className = "",
  interactive = true,
}: Shape & {
  w: number;
  h: number;
  children?: ReactNode;
  className?: string;
  /** press feedback. Off for a thumb, which is driven by the parent's selection. */
  interactive?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const path = squirclePath({ width: w, height: h, radius, smoothing, exponent });
  const clip = `path("${path}")`;

  const layer = (style: CSSProperties, key: string) => (
    <span
      key={key}
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ clipPath: clip, WebkitClipPath: clip, ...style }}
    />
  );

  // double outer hairline: faint dark contact ring, near-white cut
  const HAIRLINE =
    "drop-shadow(0 0 0.5px rgba(0,0,0,0.18)) drop-shadow(0 0.5px 0.5px rgba(255,255,255,0.9))";

  return (
    <span
      className={`relative block ${interactive ? "active:scale-[0.97] active:brightness-[1.04] transition-[transform,filter] duration-150" : ""} ${className}`}
      style={{ width: w, height: h, filter: HAIRLINE }}
    >
      {/* porcelain body */}
      {layer({ background: "linear-gradient(180deg, #ffffff 0%, #f4f4f5 52%, #ececed 100%)" }, "body")}
      {/* corner vignette */}
      {layer({ background: "radial-gradient(120% 130% at 50% 50%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.045) 100%)" }, "vig")}
      {/* centre glow */}
      {layer({ background: "radial-gradient(70% 120% at 50% 45%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%)" }, "glow")}
      {/* fine grain */}
      {layer({
        opacity: 0.05,
        mixBlendMode: "overlay",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }, "grain")}
      {/* brushed streaks — the vertical ribbing visible on the reference thumb */}
      {layer({
        opacity: 0.5,
        mixBlendMode: "overlay",
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(0,0,0,0.03) 1px, rgba(255,255,255,0.06) 2px)",
      }, "brush")}
      {/* diagonal light sweep */}
      {layer({
        mixBlendMode: "screen",
        background: "linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.28) 46%, rgba(255,255,255,0) 60%)",
      }, "sweep")}
      {/* middle sheen band */}
      {layer({
        background: "linear-gradient(180deg, rgba(255,255,255,0) 34%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 66%)",
        opacity: 0.45,
      }, "sheen")}
      {/* side edge-lights */}
      {layer({
        background: "linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 8%, rgba(255,255,255,0) 92%, rgba(255,255,255,0.5) 100%)",
        opacity: 0.5,
      }, "sides")}
      {/* top sheen */}
      {layer({ background: "radial-gradient(78% 82% at 50% -34%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.28) 42%, rgba(255,255,255,0) 72%)" }, "top")}
      {/* glass rim */}
      {layer({ boxShadow: "inset 0 2px 0 -1px rgba(255,255,255,0.85)" }, "rim")}
      {/* bottom counter-sheen */}
      {layer({ mixBlendMode: "screen", background: "radial-gradient(90% 60% at 50% 118%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 60%)" }, "counter")}
      {/* light lift along the bottom */}
      {layer({ mixBlendMode: "screen", boxShadow: "inset 0 -15px 2px -12px rgba(255,255,255,0.25)" }, "lift")}
      {/* grounding shadow along the bottom */}
      {layer({ mixBlendMode: "color-burn", boxShadow: "inset 0 -6px 5px -2px #d2d2d2" }, "ground")}
      {/* inner shadow wall */}
      {layer({ boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.06)" }, "wall")}
      {/* fresnel edge-brighten */}
      {layer({ mixBlendMode: "screen", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.28)" }, "fresnel")}
      {/* ambient occlusion ring */}
      {layer({ boxShadow: "inset 0 0 6px 0 rgba(0,0,0,0.05)" }, "ao")}
      {/* corner glints */}
      {layer({
        mixBlendMode: "screen",
        background:
          "radial-gradient(6px 5px at 14% 14%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 100%), radial-gradient(6px 5px at 86% 14%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 100%)",
      }, "glints")}

      {/* Tri-stop bevel border, stroked on the exact outline and clipped to itself
          so only the inner half shows — a clip-path on the container would slice
          the border in half and leave it uneven on the corners. */}
      <svg
        aria-hidden
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 3, display: "block" }}
      >
        <clipPath id={`sq-${uid}`}>
          <path d={path} />
        </clipPath>
        <linearGradient id={`sg-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d3d6db" />
          <stop offset="0.5" stopColor="#b4b7bd" />
          <stop offset="1" stopColor="#7f8288" />
        </linearGradient>
        <path d={path} fill="none" stroke={`url(#sg-${uid})`} strokeWidth={2} clipPath={`url(#sq-${uid})`} />
      </svg>

      {children != null && (
        <span className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
          {children}
        </span>
      )}
    </span>
  );
}

/** Recessed squircle well — the track the thumb slides inside. */
export function squircleWellStyle(w: number, h: number, radius: number, smoothing = 1, exponent = 5): CSSProperties {
  const clip = `path("${shapePath({ width: w, height: h, radius, smoothing, exponent })}")`;
  return {
    clipPath: clip,
    WebkitClipPath: clip,
    background: "linear-gradient(180deg, #ebecee 0%, #f7f7f5 100%)",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.12)",
  };
}
