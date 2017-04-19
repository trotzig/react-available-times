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
  constructor({ around, initialSelections }) {
    super();
    this.state = {
      headerHeight: 50,
    };
    this.selections = {};
    weekAt(around).forEach(({ date }) => {
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
      around,
      events,
      initialSelections,
      height,
    } = this.props;

    const { headerHeight } = this.state;

    const week = weekAt(around);

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
          {week.map((day) => (
            <DayHeader
              day={day}
              key={day.date}
            />
          ))}
        </div>
        <div
          className={styles.days}
          style={{ height: `calc(100% - ${headerHeight}px)` }}
          ref={(element) => this._daysRef = element}
        >
          <Ruler />
          {week.map((day) => (
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
  around: PropTypes.instanceOf(Date),
  initialSelections: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
  })),
  events: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
    label: PropTypes.string,
    color: PropTypes.string,
    width: PropTypes.number,
    offset: PropTypes.number,
  })),
  onChange: PropTypes.func,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

AvailableTimes.defaultProps = {
  around: new Date(),
};
