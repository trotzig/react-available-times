import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import positionInDay from './positionInDay';
import styles from './TimeSlot.css';
import zeroPad from './zeroPad';

export default class TimeSlot extends PureComponent {
  renderLabel() {
    const {
      start,
      end,
    } = this.props;

    return (
      <span className={styles.label}>
        {zeroPad(start.getHours())}:{zeroPad(start.getMinutes())}
        {' - '}
        {zeroPad(end.getHours())}:{zeroPad(end.getMinutes())}
      </span>
    );
  }

  render() {
    const {
      start,
      end,
    } = this.props;

    const top = positionInDay(start);
    const bottom = positionInDay(end);

    return (
      <div
        className={styles.component}
        style={{
          top,
          height: bottom - top,
        }}
      >
        {this.renderLabel()}
      </div>
    );
  }
}

TimeSlot.propTypes = {
  start: PropTypes.instanceOf(Date).isRequired,
  end: PropTypes.instanceOf(Date).isRequired,
}
