/** Default control height. */
export const CONTROL_H = 36;

/** Corner radius as a fixed fraction of the element's own height, so a 44px track
 *  and its 36px thumb get proportionally identical corners. */
export function radiusFor(height: number): number {
  return Math.round(height * 0.42);
}
