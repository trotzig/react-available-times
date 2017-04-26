import addOverlapHints from './addOverlapHints';


export default class EventsStore {
  constructor({
    calendars,
    onEventsRequested,
    onChange,
  }) {
    this.selectedCalendars = new Set(
      calendars.filter(({ selected }) => selected).map(({ id }) => id));
    this.calendarsById = {};
    calendars.forEach((calendar) => {
      this.calendarsById[calendar.id] = calendar;
    });
    this.onEventsRequested = onEventsRequested;
    this.onChange = onChange;
    this.timespans = [];
  }

  updateSelectedCalendars(selectedCalendars) {
    this.selectedCalendars = selectedCalendars;
    this.fetchEvents();
    for (const timespan of this.timespans) {
      timespan.overlapped = null;
    }
    this.onChange();
  }

  colorize(events) {
    // We're assuming that it's safe to mutate events here (they should have been
    // duped by addOverlapHints already).
    events.forEach((event) => {
      const { foregroundColor, backgroundColor } =
        this.calendarsById[event.calendarId];
      Object.assign(event, { foregroundColor, backgroundColor });
    });
    return events;
  }

  filterVisible(events) {
    return events.filter(({ calendarId }) => this.selectedCalendars.has(calendarId));
  }

  get(atTime) {
    for (const timespan of this.timespans) {
      const { start, end, events, overlapped } = timespan;
      if (start.getTime() <= atTime.getTime() && end.getTime() > atTime.getTime()) {
        if (overlapped) {
          return overlapped;
        }
        timespan.overlapped =
          this.colorize(addOverlapHints(this.filterVisible(events)));
        return timespan.overlapped;
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
            timespan.overlapped = null; // clear cache
            this.onChange();
          },
        });
        timespan.calendarIds.add(calendarId);
      });
    });
  }
}
