import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import Day from './Day';
import DayHeader from './DayHeader';
import Ruler from './Ruler';
import styles from './AvailableTimes.css';
import weekAt from './weekAt';

function flatten(selections) {
  const result = [];
  Object.keys(selections).forEach((dayOfWeek) => {
    result.push(...selections[dayOfWeek]);
  });
  return result;
}
export default class AvailableTimes extends PureComponent {
  constructor() {
    super();
    this.state = {
      headerHeight: 50,
    };
    this.selections = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    };
  }

  componentDidMount() {
    // Place scroll at 06:30 in the morning
    this._daysRef.scrollTop = 325;
  }

  handleDayChange(day, selections) {
    this.selections[day.getDay()] = selections;
    this.props.onChange(flatten(this.selections));
  }

  getDayEvents(date) {
    const dateString = date.toDateString();
    return this.props.events.filter(({ start }) => {
      return dateString === start.toDateString();
    });
  }

  render() {
    const week = weekAt(this.props.around);

    return (
      <div className={styles.component}>
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
          style={{ height: `calc(100vh - ${this.state.headerHeight}px)` }}
          ref={(element) => this._daysRef = element}
        >
          <Ruler />
          {week.map((day) => (
            <Day
              key={day.date}
              date={day.date}
              events={this.getDayEvents(day.date)}
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
  events: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
    label: PropTypes.string,
  })),
  onChange: PropTypes.func.isRequired,
};

AvailableTimes.defaultProps = {
  around: new Date(),
};
