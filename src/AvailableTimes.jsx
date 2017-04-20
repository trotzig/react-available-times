import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import Day from './Day';
import DayHeader from './DayHeader';
import Ruler from './Ruler';
import addOverlapHints from './addOverlapHints';
import styles from './AvailableTimes.css';
import weekAt from './weekAt';

function flatten(selections) {
  const result = [];
  Object.keys(selections).forEach((dayOfWeek) => {
    result.push(...selections[dayOfWeek]);
  });
  return result;
}

function getDayEvents(events, date) {
  const dateString = date.toDateString();
  return events.filter(({ start }) => {
    return dateString === start.toDateString();
  });
}

export default class AvailableTimes extends PureComponent {
  constructor({ start, initialSelections }) {
    super();
    this.state = {
      headerHeight: 50,
    };
    this.selections = {};
    weekAt(start).days.forEach(({ date }) => {
      this.selections[date.getDay()] = getDayEvents(initialSelections || [], date);
    });
  }

  componentDidMount() {
    // Place scroll at 06:30 in the morning
    this._daysRef.scrollTop = 325;
  }

  handleDayChange(day, selections) {
    const { onChange } = this.props;
    this.selections[day.getDay()] = selections;
    if (!onChange) {
      return;
    }
    onChange(flatten(this.selections));
  }

  render() {
    const {
      start,
      events,
      initialSelections,
      height,
    } = this.props;

    const { headerHeight } = this.state;

    const week = weekAt(start);

    return (
      <div
        className={styles.component}
        style={{
          height: height || '100vh',
        }}
      >
        <div
          className={styles.header}
          ref={(el) => el && this.setState({ headerHeight: el.offsetHeight })}
        >
          <div className={styles.toolbar}>
            {week.interval}
          </div>
          <div className={styles.headerDays}>
            {week.days.map((day) => (
              <DayHeader
                day={day}
                key={day.date}
              />
            ))}
          </div>
        </div>
        <div
          className={styles.days}
          style={{ height: `calc(100% - ${headerHeight}px)` }}
          ref={(element) => this._daysRef = element}
        >
          <Ruler />
          {week.days.map((day) => (
            <Day
              key={day.date}
              date={day.date}
              events={addOverlapHints(getDayEvents(events || [], day.date))}
              initialSelections={getDayEvents(initialSelections || [], day.date)}
              onChange={this.handleDayChange.bind(this, day.date)}
            />
          ))}
        </div>
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
  events: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
    label: PropTypes.string,
    color: PropTypes.string,
  })),
  onChange: PropTypes.func,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

AvailableTimes.defaultProps = {
  start: new Date(),
};
