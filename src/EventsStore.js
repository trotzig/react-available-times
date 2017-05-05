import decorateEvents from './decorateEvents';

export default class EventsStore {
  constructor({
    calendars,
    timeZone,
    onEventsRequested,
    onChange,
  }) {
    this.selectedCalendars = new Set(
      calendars.filter(({ selected }) => selected).map(({ id }) => id));
    this.timeZone = timeZone;
    this.calendarsById = {};
    calendars.forEach((calendar) => {
      this.calendarsById[calendar.id] = calendar;
    });
    this.onEventsRequested = onEventsRequested;
    this.onChange = onChange;
    this.timespans = [];
  }

  cancel() {
    this.onChange = () => {};
  }

  updateSelectedCalendars(selectedCalendars) {
    this.selectedCalendars = selectedCalendars;
    this.fetchEvents();
    this.timespans.forEach((timespan) => {
      // eslint-disable-next-line no-param-reassign
      timespan.decoratedEvents = null;
    });
    this.onChange();
  }

  colorize(events) {
    // We're assuming that it's safe to mutate events here (they should have been
    // duped by decorateEvents already).
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
    for (let i = 0; i < this.timespans.length; i++) {
      const timespan = this.timespans[i];
      const { start, end, events, decoratedEvents } = timespan;
      if (start.getTime() <= atTime.getTime() && end.getTime() > atTime.getTime()) {
        if (decoratedEvents) {
          return decoratedEvents;
        }
        timespan.decoratedEvents =
          this.colorize(decorateEvents(this.filterVisible(events), this.timeZone));
        return timespan.decoratedEvents;
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
            // eslint-disable-next-line no-param-reassign
            timespan.decoratedEvents = null; // clear cache
            this.onChange();
          },
        });
        timespan.calendarIds.add(calendarId);
      });
    });
  }
}
