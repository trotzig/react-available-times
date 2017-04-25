export default function getIncludedEvents(events, dayStart, dayEnd) {
  return events.filter(({ start, end, allDay }) => {
    if (allDay) {
      return dayStart >= start && dayStart < end;
    }
    return (dayStart <= start && start < dayEnd) ||
      (dayStart <= end && end < dayEnd);
  });
}
