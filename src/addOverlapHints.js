export default function addOverlapHints(events) {
  // Make sure events are sorted by start time
  const orderedByStartTime = [...events.sort((a, b) => a.start < b.start ? -1 : 1)];
  const orderedByEndTime = [...events.sort((a, b) => a.end < b.end ? -1 : 1)];

  const result = [];

  for (let i = 0; i < orderedByStartTime.length; i++) {
    const current = orderedByStartTime[i];
    let overlaps = new Set();
    // Iterate backwards to find overlaps
    for (let j = orderedByEndTime.indexOf(current) - 1; j >= 0; j--) {
      const previous = orderedByEndTime[j];
      if (previous.end > current.start) {
        overlaps.add(previous);
      } else {
        break;
      }
    }
    // Iterate forward to find overlaps
    for (let k = i + 1; k < orderedByStartTime.length; k++) {
      const next = orderedByStartTime[k];
      if (next.start < current.end) {
        overlaps.add(next);
      } else {
        break;
      }
    }
    result.push({
      start: current.start,
      end: current.end,
      overlaps: overlaps.size,
    });
  }
  return result;
}
