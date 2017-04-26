import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { WEEKS_PER_TIMESPAN } from './Constants';
import CalendarSelector from './CalendarSelector';
import EventsStore from './EventsStore';
import Slider from './Slider';
import Week from './Week';
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

export default class AvailableTimes extends PureComponent {
  constructor({
    initialSelections = [],
    start = new Date(),
    calendars = [],
  }) {
    super();
    const selectedCalendars = new Set(
      calendars.filter(({ selected }) => selected).map(({ id }) => id));

    this.state = {
      weeks: [],
      currentWeekIndex: 0,
      selectedCalendars,
      events: [],
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
    this.handleHomeClick = () => this.setState(({ weeks }) => ({
      currentWeekIndex: 0,
      events: this.eventsStore.get(weeks[0].start),
    }));
    this.handleCalendarChange = this.handleCalendarChange.bind(this);
    this.setAvailableWidth = this.setAvailableWidth.bind(this);
    this.setRef = this.setRef.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowResize);
    const { calendars, onEventsRequested } = this.props;
    this.eventsStore = new EventsStore({
      calendars,
      onEventsRequested,
      onChange: () => {
        this.setState(({ weeks, currentWeekIndex }) => {
          return {
            events: this.eventsStore.get(weeks[currentWeekIndex].start),
          };
        });
      }
    });
    this.setState({
      weeks: this.expandWeeks(this.state.weeks, 0),
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
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

  handleCalendarChange(selectedCalendars) {
    this.setState({ selectedCalendars });
    this.eventsStore.updateSelectedCalendars(selectedCalendars);
  }

  expandWeeks(weeks, weekIndex) {
    if (weeks.length - weekIndex > WEEKS_PER_TIMESPAN) {
      // no need to expand
      return weeks;
    }

    let newWeeks = weeks;
    let addedWeeks = 0;
    while (addedWeeks < WEEKS_PER_TIMESPAN) {
      const week = newWeeks.length ?
        weekAt(oneWeekAhead(newWeeks[newWeeks.length - 1].days[3].date)) :
          weekAt(this.props.start);
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
      selectedCalendars,
      currentWeekIndex,
      weeks,
    }) => {
      const nextIndex = currentWeekIndex + increment;
      if (nextIndex < 0) {
        return;
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
      initialSelections,
    } = this.props;

    const {
      availableWidth,
      currentWeekIndex,
      selectedCalendars,
      weeks,
      events,
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
                selectedCalendars={selectedCalendars}
                onChange={this.handleCalendarChange}
              />
            </div>
          </div>
          <div className={styles.main}>
            <Slider
              index={currentWeekIndex}
              onSlide={this.move}
            >
              {weeks.map((week, i) => {
                return (
                  <Week
                    availableWidth={availableWidth}
                    calendars={calendars}
                    key={week.days[0].date}
                    week={week}
                    events={events}
                    initialSelections={initialSelections}
                    onChange={this.handleWeekChange}
                    height={height}
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
