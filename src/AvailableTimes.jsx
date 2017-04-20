import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Week from './Week';
import styles from './AvailableTimes.css';
import weekAt from './weekAt';

function oneWeekAhead(date) {
  const result = new Date(date.getTime());
  result.setDate(date.getDate() + 7);
  return result;
}

export default class AvailableTimes extends Component {
  constructor({ start }) {
    super();
    this.state = {
      weeks: [
        weekAt(start),
        //weekAt(oneWeekAhead(start)),
      ],
      currentWeekIndex: 0,
    };
  }

  handleChange(week, selections) {

  }

  render() {
    const {
      events,
      height,
      initialSelections,
    } = this.props;

    return (
      <div
        className={styles.component}
        style={{
          height,
        }}
      >
        <div className={styles.toolbar}>
          {this.state.weeks[this.state.currentWeekIndex].interval}
        </div>
        <div className={styles.main}>
          {this.state.weeks.map((week) => (
            <Week
              key={week.days[0].date}
              week={week}
              initialSelections={initialSelections}
              onChange={this.handleChange.bind(this, week)}
              height={height}
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
