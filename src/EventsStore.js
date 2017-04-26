export default class EventsStore {
  constructor({
    selectedCalendars,
    onEventsRequested,
    onChange,
  }) {
    this.selectedCalendars = selectedCalendars;
    this.onEventsRequested = onEventsRequested;
    this.onChange = onChange;
    this.timespans = [];
  }

  updateSelectedCalendars(selectedCalendars) {
    this.selectedCalendars = selectedCalendars;
    this.fetchEvents();
  }

  get(atTime) {
    for (const { start, end, events } of this.timespans) {
      if (start.getTime() <= atTime.getTime() && end.getTime() > atTime.getTime()) {
        return events;
      }
    }
    return [];
  }

  addTimespan({ start, end }) {
    this.timespans.push({
      start,
      end,
      events: [],
      calendarIds: new Set(),
    });
    this.fetchEvents();
  }

  fetchEvents() {
    this.selectedCalendars.forEach((calendarId) => {
      this.timespans.forEach((timespan) => {
        if (timespan.calendarIds.has(calendarId)) {
          // already fetched for this calendar
          return;
        }
        this.onEventsRequested({
          calendarId,
          start: timespan.start,
          end: timespan.end,
          callback: (events) => {
            timespan.events.push(...events);
            this.onChange({
              start: timespan.start,
              end: timespan.end,
              events: timespan.events,
            });
          },
        });
        timespan.calendarIds.add(calendarId);
      });
    });
  }
}
