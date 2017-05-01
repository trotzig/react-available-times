import momentTimezone from 'moment-timezone';

import hasOverlap from './hasOverlap';

function compareDates(a, b) {
  return a.start < b.start ? -1 : 1;
}

function groupEvents(events) {
  const groups = [];
  events.forEach((event) => {
    // Add all allDay events in separate groups
    if (!event.allDay) {
      return;
    }
    groups.push({
      start: event.start,
      end: event.end,
      columns: [[event]],
    });
  });

  let currentGroup;
  events.forEach((event) => {
    if (event.allDay) {
      // ignore
      return;
    }
    if (currentGroup && event.start >= currentGroup.end) {
      currentGroup = undefined;
    }
    if (currentGroup) {
      const existingCol = currentGroup.columns.find(
        column => column.some(({ end }) => end <= event.start));
      if (existingCol) {
        existingCol.push(event);
      } else {
        currentGroup.columns.push([event]);
      }
    }
    if (!currentGroup) {
      currentGroup = {
        start: event.start,
        end: event.end,
        columns: [[event]],
      };
      groups.push(currentGroup);
    }
    currentGroup.end = Math.max(currentGroup.end, event.end);
  });
  return groups;
}

function flattenGroups(groups) {
  const result = [];
  groups.forEach((group) => {
    const columnsLength = group.columns.length;
    group.columns.forEach((events, columnIndex) => {
      events.forEach((event) => {
        let colspan = 1;
        // Peek ahead to see if the event fits in another column
        let j = columnIndex + 1;
        while (
          j < group.columns.length &&
          !hasOverlap(group.columns[j], event.start, event.end)
        ) {
          colspan++;
          j++;
        }
        result.push(Object.assign({
          width: colspan / columnsLength,
          offset: columnIndex / columnsLength,
        }, event));
      });
    });
  });
  result.sort(compareDates);
  return result;
}

function normalize(events, timeZone) {
  return events.map(event => Object.assign({}, event, {
    start: momentTimezone.tz(event.start, timeZone).toDate(),
    end: momentTimezone.tz(event.end, timeZone).toDate(),
  }));
}

export default function decorateEvents(events, timeZone) {
  // Make sure events are sorted by start time
  const orderedByStartTime = normalize(events, timeZone).sort(compareDates);
  const groups = groupEvents(orderedByStartTime);
  return flattenGroups(groups);
}
