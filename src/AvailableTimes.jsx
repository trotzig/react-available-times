import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Day from './Day';
import DayHeader from './DayHeader';
import Ruler from './Ruler';
import styles from './AvailableTimes.css';
import weekAt from './weekAt';

export default class AvailableTimes extends Component {
  render() {
    const week = weekAt(this.props.around);

    return (
      <div className={styles.component}>
        <div className={styles.header}>
          {week.map((day) => (
            <DayHeader
              day={day}
              key={day.date}
            />
          ))}
        </div>
        <div className={styles.days}>
          <Ruler />
          {week.map((day) => (
            <Day key={day.date} />
          ))}
        </div>
      </div>
    );
  }
}

AvailableTimes.propTypes = {
  around: PropTypes.instanceOf(Date),
};

AvailableTimes.defaultProps = {
  around: new Date(),
};
