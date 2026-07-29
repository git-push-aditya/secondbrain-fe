/* Self-check for the dashboard's week bucketing — no test runner in this repo.
   Run: node src/utils/weekly.check.ts   (from the frontend root) */
import assert from "node:assert/strict";
import { bucketByWeek, weekOnWeek } from "./weekly.ts";

const DAY = 864e5;
const now = new Date("2026-07-29T12:00:00Z").getTime();
const ago = (days: number) => new Date(now - days * DAY).toISOString();

// newest bucket is last; a same-day save lands in it
const w = bucketByWeek([ago(0), ago(1), ago(8), ago(8), ago(70)], now, 10);
assert.equal(w.counts.length, 10);
assert.equal(w.counts[9], 2, "this week");
assert.equal(w.counts[8], 2, "last week");
assert.equal(w.counts[0], 0, "70d ago is one week past the 10-week window");
assert.equal(w.counts.reduce((a, b) => a + b), 4);
assert.equal(w.labels.length, 10);

// junk and future dates are dropped, never written out of bounds
const junk = bucketByWeek(["not a date", "", new Date(now + 30 * DAY).toISOString()], now, 4);
assert.deepEqual(junk.counts, [0, 0, 0, 0]);

// deltas
assert.equal(weekOnWeek(bucketByWeek([ago(0), ago(0), ago(8)], now, 3)), 100);
assert.equal(weekOnWeek(bucketByWeek([ago(0)], now, 3)), null, "no baseline -> null");

console.log("weekly.ts ok");
