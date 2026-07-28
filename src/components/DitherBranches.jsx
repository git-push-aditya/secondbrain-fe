import { useEffect, useRef } from 'react';

/**
 * Dot-dithered branches radiating from a point out to a set of targets.
 *
 * Two passes: soft tapered curves are stroked into an offscreen mask, then an
 * 8x8 Bayer threshold turns that mask into dots. The taper becomes a density
 * falloff — dots thin out toward the ends — which is what reads as "dithered"
 * rather than a plain dotted line.
 *
 * origin / targets are normalized (0..1) so they track the brain and the cards
 * at any panel size.
 */

// ponytail: same 8x8 Bayer matrix the Dither shader uses, as a flat array
const BAYER = [
    0, 48, 12, 60, 3, 51, 15, 63,
    32, 16, 44, 28, 35, 19, 47, 31,
    8, 56, 4, 52, 11, 59, 7, 55,
    40, 24, 36, 20, 43, 27, 39, 23,
    2, 50, 14, 62, 1, 49, 13, 61,
    34, 18, 46, 30, 33, 17, 45, 29,
    10, 58, 6, 54, 9, 57, 5, 53,
    42, 26, 38, 22, 41, 25, 37, 21
];

export default function DitherBranches({
    origin = [0.5, 0.5],
    targets,   // [[x, y], ...] normalized; no default so TS doesn't infer never[]
    color = '255,255,255',
    dotSize = 6,
    thickness = 0.055,   // stroke width, as a fraction of the stage's short side
    startAt = 0.17,      // how far along the branch to start (clears the brain)
    bend = 0.22,         // sideways curve, alternating per branch
    speed = 0.55,        // travelling density pulse, 0 disables
    className = ''
}) {
    const canvasRef = useRef(null);
    const cfg = useRef(null);
    cfg.current = { origin, targets, color, dotSize, thickness, startAt, bend, speed };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const mask = document.createElement('canvas');
        const maskCtx = mask.getContext('2d', { willReadFrequently: true });

        let raf = 0;
        let start = 0;

        const drawMask = (w, h) => {
            const c = cfg.current;
            const short = Math.min(w, h);
            const ox = c.origin[0] * w, oy = c.origin[1] * h;

            maskCtx.clearRect(0, 0, w, h);
            maskCtx.lineCap = 'round';
            maskCtx.lineJoin = 'round';

            (c.targets || []).forEach(([tx0, ty0], i) => {
                const tx = tx0 * w, ty = ty0 * h;
                const dx = tx - ox, dy = ty - oy;
                const len = Math.hypot(dx, dy) || 1;

                // start out from the brain's edge, not its centre
                const sx = ox + dx * c.startAt, sy = oy + dy * c.startAt;

                // control point pushed perpendicular, flipping side per branch
                const side = i % 2 === 0 ? 1 : -1;
                const cx = (sx + tx) / 2 + (-dy / len) * len * c.bend * side;
                const cy = (sy + ty) / 2 + (dx / len) * len * c.bend * side;

                const grd = maskCtx.createLinearGradient(sx, sy, tx, ty);
                grd.addColorStop(0, 'rgba(255,255,255,1)');
                grd.addColorStop(0.55, 'rgba(255,255,255,0.62)');
                grd.addColorStop(1, 'rgba(255,255,255,0.12)');

                maskCtx.strokeStyle = grd;
                maskCtx.lineWidth = short * c.thickness;
                maskCtx.beginPath();
                maskCtx.moveTo(sx, sy);
                maskCtx.quadraticCurveTo(cx, cy, tx, ty);
                maskCtx.stroke();
            });
        };

        const frame = now => {
            raf = requestAnimationFrame(frame);
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = Math.floor(canvas.clientWidth * dpr);
            const h = Math.floor(canvas.clientHeight * dpr);
            if (!w || !h) return;
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = mask.width = w;
                canvas.height = mask.height = h;
            }
            if (!start) start = now;
            const t = (now - start) / 1000;

            const c = cfg.current;
            const cell = Math.max(2, c.dotSize * dpr);
            const dot = cell * 0.62;

            drawMask(w, h);
            const data = maskCtx.getImageData(0, 0, w, h).data;

            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = `rgb(${c.color})`;

            const ox = c.origin[0] * w, oy = c.origin[1] * h;
            const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);

            for (let gy = 0; gy < rows; gy++) {
                for (let gx = 0; gx < cols; gx++) {
                    const px = Math.min(w - 1, Math.floor(gx * cell + cell / 2));
                    const py = Math.min(h - 1, Math.floor(gy * cell + cell / 2));
                    let a = data[(py * w + px) * 4 + 3] / 255;
                    if (a <= 0.02) continue;

                    // travelling pulse so the dots feel like they're flowing outward
                    if (c.speed) {
                        const d = Math.hypot(px - ox, py - oy) / Math.min(w, h);
                        a *= 0.72 + 0.38 * Math.sin(d * 16 - t * c.speed * 6);
                    }

                    const threshold = (BAYER[(gy % 8) * 8 + (gx % 8)] + 0.5) / 64;
                    if (a <= threshold) continue;

                    ctx.fillRect(gx * cell, gy * cell, dot, dot);
                }
            }
        };

        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
    }, []);

    return <canvas ref={canvasRef} className={`w-full h-full block ${className}`} />;
}
