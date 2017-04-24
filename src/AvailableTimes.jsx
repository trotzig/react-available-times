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
    events = [],
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
      overlappedEvents: colorize(
        addOverlapHints(
          filterVisible(events, visibleCalendars)
        ),
        calendars,
      ),
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
  }

  componentWillMount() {
    this.triggerTimespanInit(this.state.weeks);
  }

  triggerTimespanInit(weeks) {
    const { onTimespanInit } = this.props;
    if (onTimespanInit) {
      onTimespanInit({
        start: weeks[0].start,
        end: weeks[weeks.length - 1].end,
      });
    }
  }

  componentWillReceiveProps({ events }) {
    if (events === this.props.events) {
      // nothing to do
      return;
    }
    this.setState(({ visibleCalendars }) => ({
      overlappedEvents: colorize(
        addOverlapHints(
          filterVisible(events, visibleCalendars)
        ),
        this.props.calendars
      )
    }));
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
    const {
      events,
      calendars,
      onCalendarSelected,
    } = this.props;

    this.setState({
      visibleCalendars,
      overlappedEvents: colorize(
        addOverlapHints(
          filterVisible(events, visibleCalendars)
        ),
        calendars
      ),
    });
    if (onCalendarSelected) {
      onCalendarSelected([...visibleCalendars]);
    }
  }

  move(increment) {
    this.setState(({ currentWeekIndex, weeks }) => {
      const nextIndex = currentWeekIndex + increment;
      if (nextIndex < 0) {
        return;
      }

      let nextWeeks = weeks;
      if (increment > 0) {
        const newWeek = weekAt(oneWeekAhead(weeks[weeks.length - 1].days[3].date));
        nextWeeks = weeks.concat(newWeek);
        this.triggerTimespanInit(nextWeeks);
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
      currentWeekIndex,
      visibleCalendars,
      weeks,
    } = this.state;

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
  events: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
    title: PropTypes.string,
    calendarId: PropTypes.string,
  })),
  onChange: PropTypes.func,
  onCalendarSelected: PropTypes.func,
  onTimespanInit: PropTypes.func,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
