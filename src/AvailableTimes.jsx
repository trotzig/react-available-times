import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import Day from './Day';
import DayHeader from './DayHeader';
import Ruler from './Ruler';
import styles from './AvailableTimes.css';
import weekAt from './weekAt';

export default class AvailableTimes extends PureComponent {
  constructor() {
    super();
    this.state = {
      headerHeight: 50,
    };
  }

  componentDidMount() {
    // Place scroll at 06:30 in the morning
    this._daysRef.scrollTop = 325;
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
