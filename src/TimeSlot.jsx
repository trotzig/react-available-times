import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import withAvailableWidth from 'react-with-available-width';

import positionInDay from './positionInDay';
import styles from './TimeSlot.css';
import zeroPad from './zeroPad';

class TimeSlot extends PureComponent {
  label() {
    const { start, end } = this.props;
    const from = `${zeroPad(start.getHours())}:${zeroPad(start.getMinutes())}`;
    const to = `${zeroPad(end.getHours())}:${zeroPad(end.getMinutes())}`;
    return `${from} - ${to}`;
  }

  render() {
    const {
      start,
      end,
      availableWidth,
    } = this.props;

    const top = positionInDay(start);
    const bottom = positionInDay(end);

    const height = bottom - top;

    const labelClasses = [styles.label];
    const labelStyle = {};
    if (height > availableWidth && availableWidth < 60) {
      labelClasses.push(styles.flip);
      labelStyle.width = height;
      labelStyle.marginLeft = -((height / 2) - 10);
      labelStyle.marginTop = -10;
    }

    return (
      <div
        className={styles.component}
        style={{
          top,
          height: bottom - top,
        }}
      >
        <div
          className={labelClasses.join(' ')}
          style={labelStyle}
        >
          {this.label()}
        </div>
        <div className={styles.handle}>
          ...
        </div>
      </div>
    );
  }
}

TimeSlot.propTypes = {
  start: PropTypes.instanceOf(Date).isRequired,
  end: PropTypes.instanceOf(Date).isRequired,
  availableWidth: PropTypes.number.isRequired,
}

export default withAvailableWidth(TimeSlot);
