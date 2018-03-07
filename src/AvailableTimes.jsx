import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import momentTimezone from 'moment-timezone';

import { WEEKS_PER_TIMESPAN } from './Constants';
import CalendarSelector from './CalendarSelector';
import EventsStore from './EventsStore';
import Slider from './Slider';
import Week from './Week';
import makeRecurring from './makeRecurring';
import normalizeRecurringSelections from './normalizeRecurringSelections';
import styles from './AvailableTimes.css';
import weekAt from './weekAt';

const leftArrowSvg = (
  <svg height="24" viewBox="0 0 24 24" width="24">
    <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
    <path d="M0-.5h24v24H0z" fill="none" />
  </svg>
);

const rightArrowSvg = (
  <svg height="24" viewBox="0 0 24 24" width="24">
    <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" />
    <path d="M0-.25h24v24H0z" fill="none" />
  </svg>
);

function oneWeekAhead(date, tz) {
  const m = momentTimezone.tz(date, tz);
  m.week(m.week() + 1);
  return m.toDate();
}

function flatten(selections) {
  const result = [];
  Object.keys(selections).forEach((date) => {
    result.push(...selections[date]);
  });
  return result;
}

export default class AvailableTimes extends PureComponent {
  constructor({
    calendars = [],
    initialSelections = [],
    recurring,
    timeZone,
    weekStartsOn,
  }) {
    super();
    const selectedCalendars =
      calendars.filter(({ selected }) => selected).map(({ id }) => id);

    const normalizedSelections = recurring ?
      normalizeRecurringSelections(initialSelections, timeZone, weekStartsOn) :
      initialSelections;
    this.state = {
      weeks: [],
      currentWeekIndex: 0,
      selectedCalendars,
      events: [],
      selections: normalizedSelections,
      availableWidth: 10,
    };
    this.selections = {};
    normalizedSelections.forEach((selection) => {
      const week = weekAt(weekStartsOn, selection.start, timeZone);
      const existing = this.selections[week.start] || [];
      existing.push(selection);
      this.selections[week.start] = existing;
    });
    this.handleWeekChange = this.handleWeekChange.bind(this);
    this.moveBack = this.move.bind(this, -1);
    this.moveForward = this.move.bind(this, 1);
    this.move = this.move.bind(this);
    this.handleHomeClick = () => this.setState(({ weeks }) => ({
      currentWeekIndex: 0,
      events: this.eventsStore.get(weeks[0].start),
    }));
    this.handleCalendarChange = this.handleCalendarChange.bind(this);
    this.setRef = this.setRef.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowResize);
    const { calendars = [], onEventsRequested, timeZone } = this.props;
    this.eventsStore = new EventsStore({
      calendars,
      timeZone,
      onEventsRequested,
      onChange: () => {
        this.setState(({ weeks, currentWeekIndex }) => ({
          events: this.eventsStore.get(weeks[currentWeekIndex].start),
        }));
      },
    });
    this.setState({
      weeks: this.expandWeeks(this.state.weeks, 0),
    });
  }

  componentWillReceiveProps({ recurring }) {
    if (recurring === this.props.recurring) {
      return;
    }
    this.setState({ currentWeekIndex: 0 });
  }

  componentDidUpdate({ recurring }) {
    if (recurring === this.props.recurring) {
      return;
    }
    this.triggerOnChange();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
    this.eventsStore.cancel();
  }

  setRef(element) {
    if (!element) {
      return;
    }
    this.ref = element;
    this.setState({
      availableWidth: element.offsetWidth,
    });
  }

  handleWindowResize() {
    this.setState({
      availableWidth: this.ref.offsetWidth,
    });
  }

  triggerOnChange() {
    const { onChange, recurring, timeZone, weekStartsOn } = this.props;
    const newSelections = flatten(this.selections);
    if (onChange) {
      if (recurring) {
        const startingFirstWeek = newSelections.filter(({ start }) =>
          start < this.state.weeks[0].end);
        onChange(startingFirstWeek.map(selection =>
          makeRecurring(selection, timeZone, weekStartsOn)));
      } else {
        onChange(newSelections);
      }
    }
    return newSelections;
  }

  handleWeekChange(week, weekSelections) {
    this.selections[week.start] = weekSelections;
    const newSelections = this.triggerOnChange();
    this.setState({
      selections: newSelections,
    });
  }

  handleCalendarChange(selectedCalendars) {
    this.setState({ selectedCalendars });
    this.eventsStore.updateSelectedCalendars(selectedCalendars);
  }

  expandWeeks(weeks, weekIndex) {
    if (weeks.length - weekIndex > WEEKS_PER_TIMESPAN) {
      // no need to expand
      return weeks;
    }

    const { weekStartsOn, timeZone } = this.props;
    let newWeeks = weeks;
    let addedWeeks = 0;
    while (addedWeeks < WEEKS_PER_TIMESPAN) {
      const week = newWeeks.length ?
        weekAt(weekStartsOn,
          oneWeekAhead(newWeeks[newWeeks.length - 1].days[3].date, timeZone), timeZone)
        : weekAt(weekStartsOn, new Date(), timeZone);
      newWeeks = newWeeks.concat(week);
      addedWeeks++;
    }
    setTimeout(() => {
      this.eventsStore.addTimespan({
        start: newWeeks[newWeeks.length - WEEKS_PER_TIMESPAN].start,
        end: newWeeks[newWeeks.length - 1].end,
      });
    });
    return newWeeks;
  }

  move(increment) {
    this.setState(({
      currentWeekIndex,
      weeks,
    }) => {
      const nextIndex = currentWeekIndex + increment;
      if (nextIndex < 0) {
        return undefined;
      }
      return {
        weeks: this.expandWeeks(weeks, nextIndex),
        currentWeekIndex: nextIndex,
        events: this.eventsStore.get(weeks[nextIndex].start),
      };
    });
  }

  render() {
    const {
      calendars,
      height,
      timeConvention,
      timeZone,
      recurring,
      touchToDeleteSelection,
    } = this.props;

    const {
      availableWidth,
      currentWeekIndex,
      selectedCalendars,
      selections,
      weeks,
      events,
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
        ref={this.setRef}
      >
        <div
          className={styles.inner}
        >
          {!recurring &&
            <div className={styles.toolbar}>
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
              <div className={styles.interval}>
                {weeks[currentWeekIndex].interval}
              </div>
              {calendars && calendars.length > 0 &&
                <div className={styles.calendarSelector}>
                  <CalendarSelector
                    calendars={calendars}
                    selectedCalendars={selectedCalendars}
                    onChange={this.handleCalendarChange}
                  />
                </div>
              }
            </div>
          }
          <div className={styles.main}>
            <Slider
              index={currentWeekIndex}
              onSlide={this.move}
              disabled={recurring}
            >
              {weeks.map((week, i) => {
                if ((recurring || Math.abs(i - currentWeekIndex) > 1) && i !== 0) {
                  return <span key={week.start} />;
                }
                return (
                  <Week
                    timeConvention={timeConvention}
                    timeZone={timeZone}
                    availableWidth={availableWidth}
                    calendars={calendars}
                    key={week.start}
                    week={week}
                    events={recurring ? [] : events}
                    initialSelections={selections}
                    onChange={this.handleWeekChange}
                    height={height}
                    recurring={recurring}
                    touchToDeleteSelection={touchToDeleteSelection}
                  />
                );
              })}
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
  timeConvention: PropTypes.oneOf(['12h', '24h']),
  timeZone: PropTypes.string.isRequired,
  initialSelections: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.number,
    ]),
    end: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.number,
    ]),
  })),
  calendars: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    color: PropTypes.string,
    selected: PropTypes.bool,
  })),
  weekStartsOn: PropTypes.oneOf(['sunday', 'monday']),
  onChange: PropTypes.func,
  onEventsRequested: PropTypes.func,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  recurring: PropTypes.bool,
  touchToDeleteSelection: PropTypes.bool,
};

AvailableTimes.defaultProps = {
  timeZone: momentTimezone.tz.guess(),
  weekStartsOn: 'sunday',
  touchToDeleteSelection: false,
};
