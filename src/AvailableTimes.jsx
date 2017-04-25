import PropTypes from 'prop-types';
import React, { Component } from 'react';

import CalendarSelector from './CalendarSelector';
import Slider from './Slider';
import Week from './Week';
import addOverlapHints from './addOverlapHints';
import styles from './AvailableTimes.css';
import weekAt from './weekAt';

const leftArrowSvg = (
  <svg height="24" viewBox="0 0 24 24" width="24">
    <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/>
    <path d="M0-.5h24v24H0z" fill="none"/>
  </svg>
);

const rightArrowSvg = (
  <svg height="24" viewBox="0 0 24 24" width="24">
    <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/>
    <path d="M0-.25h24v24H0z" fill="none"/>
  </svg>
);

function oneWeekAhead(date) {
  const result = new Date(date.getTime());
  result.setDate(date.getDate() + 7);
  return result;
}

function flatten(selections) {
  const result = [];
  Object.keys(selections).forEach((date) => {
    result.push(...selections[date]);
  });
  return result;
}

function colorize(events, calendars = []) {
  const byId = {};
  calendars.forEach(({ id, foregroundColor, backgroundColor }) => {
    byId[id] = { foregroundColor, backgroundColor };
  });
  // We're assuming that it's safe to mutate events here (they should have been
  // duped by addOverlapHints already).
  events.forEach((event) => {
    Object.assign(event, byId[event.calendarId]);
  });
  return events;
}

/**
 * @param {Array<Object>} events
 * @param {Set<String>} visibleCalendars
 * @return {Array<Object>}
 */
function filterVisible(events, visibleCalendars) {
  return events.filter(({ calendarId }) => visibleCalendars.has(calendarId));
}

export default class AvailableTimes extends Component {
  constructor({
    initialSelections = [],
    start = new Date(),
    calendars = [],
  }) {
    super();
    const visibleCalendars = new Set(
      calendars.filter(({ selected }) => selected).map(({ id }) => id));

    this.state = {
      weeks: [
        weekAt(start),
        weekAt(oneWeekAhead(start)),
      ],
      currentWeekIndex: 0,
      visibleCalendars,
      overlappedEvents: [],
    };
    this.selections = {};
    initialSelections.forEach((selection) => {
      const week = weekAt(selection.start);
      const existing = this.selections[week.days[0].date] || [];
      existing.push(selection);
      this.selections[week.days[0].date] = existing;
    });
    this.handleWeekChange = this.handleWeekChange.bind(this);
    this.moveBack = this.move.bind(this, -1);
    this.moveForward = this.move.bind(this, 1);
    this.move = this.move.bind(this);
    this.handleHomeClick = () => this.setState({ currentWeekIndex: 0 });
    this.handleCalendarChange = this.handleCalendarChange.bind(this);
    this.setAvailableWidth = this.setAvailableWidth.bind(this);
    this.setRef = this.setRef.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);

    this.timespansPerCalendar = {};
    calendars.forEach((calendar) => {
      this.timespansPerCalendar[calendar.id] = {
        start: this.state.weeks[0].start,
        end: this.state.weeks[0].start,
        events: [],
      };
    })
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowResize);
    this.triggerEventsRequested(this.state.weeks, this.state.visibleCalendars);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  triggerEventsRequested(weeks, visibleCalendars) {
    const { onEventsRequested } = this.props;
    if (!onEventsRequested) {
      return;
    }
    visibleCalendars.forEach((calendarId) => {
      const timespan = this.timespansPerCalendar[calendarId];
      const { end } = weeks[weeks.length - 1];
      if (timespan.end < end) {
        onEventsRequested({
          calendarId,
          start: timespan.end,
          end,
          callback: (events) => {
            timespan.events = timespan.events.concat(events);
            this.updateEvents(visibleCalendars);
          },
        });
        timespan.end = end;
      }
    });
  }

  handleWindowResize() {
    this.setState({
      availableWidth: this.ref.offsetWidth,
    });
  }

  setRef(element) {
    if (!element) {
      return;
    }
    this.ref = element;
  }

  setAvailableWidth(el) {
    if (!el) {
      return;
    }
    this.setState({
      availableWidth: el.offsetWidth,
    });
  }

  handleWeekChange(week, selections) {
    const { onChange } = this.props;
    this.selections[week.days[0].date] = selections;
    if (!onChange) {
      return;
    }
    onChange(flatten(this.selections));
  }

  handleCalendarChange(visibleCalendars) {
    this.setState({ visibleCalendars });
    this.updateEvents(visibleCalendars);
    this.triggerEventsRequested(this.state.weeks, visibleCalendars);
  }

  updateEvents(visibleCalendars) {
    const { calendars } = this.props;
    const events = [];
    Object.keys(this.timespansPerCalendar).forEach((calendarId) => {
      events.push(...this.timespansPerCalendar[calendarId].events);
    });
    this.setState({
      overlappedEvents: colorize(
        addOverlapHints(
          filterVisible(events, visibleCalendars)
        ),
        calendars
      ),
    });
  }

  move(increment) {
    this.setState(({ currentWeekIndex, weeks }) => {
      const nextIndex = currentWeekIndex + increment;
      if (nextIndex < 0) {
        return;
      }

      let nextWeeks = weeks;
      if (increment > 0 && weeks.length - nextIndex < 2) {
        const newWeek = weekAt(oneWeekAhead(weeks[weeks.length - 1].days[3].date));
        nextWeeks = weeks.concat(newWeek);
        this.triggerEventsRequested(nextWeeks, this.state.visibleCalendars);
      }

      return {
        weeks: nextWeeks,
        currentWeekIndex: nextIndex,
      };
    });
  }

  render() {
    const {
      calendars,
      height,
      initialSelections,
    } = this.props;

    const {
      availableWidth,
      currentWeekIndex,
      visibleCalendars,
      weeks,
    } = this.state;

    if (!availableWidth) {
      // We need to measure things once first
      return (
        <div style={{ width: '100%' }} ref={this.setAvailableWidth} />
      );
    }

    const homeClasses = [styles.home];
    if (currentWeekIndex !== 0) {
      homeClasses.push(styles.homeActive);
    }

    return (
      <div
        className={styles.component}
        style={{
          height,
        }}
        ref={this.setRef}
      >
        <div
          className={styles.inner}
        >
          <div className={styles.toolbar}>
            <div className={styles.interval}>
              {weeks[currentWeekIndex].interval}
            </div>
            <div className={styles.buttons}>
              <button
                className={styles.button}
                onClick={this.moveBack}
              >
                {leftArrowSvg}
              </button>
              {' '}
              <button
                className={styles.button}
                onClick={this.moveForward}
              >
                {rightArrowSvg}
              </button>
            </div>
            <div className={styles.calendarSelector}>
              <CalendarSelector
                calendars={calendars}
                visibleCalendars={visibleCalendars}
                onChange={this.handleCalendarChange}
              />
            </div>
          </div>
          <div className={styles.main}>
            <Slider
              index={currentWeekIndex}
              onSlide={this.move}
            >
              {weeks.map((week, i) => (
                <Week
                  availableWidth={availableWidth}
                  calendars={calendars}
                  key={week.days[0].date}
                  week={week}
                  events={this.state.overlappedEvents}
                  initialSelections={initialSelections}
                  onChange={this.handleWeekChange}
                  height={height}
                />
              ))}
            </Slider>
          </div>
        </div>
        <button
          className={homeClasses.join(' ')}
          onClick={this.handleHomeClick}
        >
          {leftArrowSvg}
        </button>
      </div>
    );
  }
}

AvailableTimes.propTypes = {
  start: PropTypes.instanceOf(Date),
  initialSelections: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
  })),
  calendars: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    color: PropTypes.string,
    selected: PropTypes.bool,
  })),
  onChange: PropTypes.func,
  onEventsRequested: PropTypes.func,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
