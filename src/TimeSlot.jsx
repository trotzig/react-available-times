import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import withAvailableWidth from 'react-with-available-width';

import positionInDay from './positionInDay';
import styles from './TimeSlot.css';
import zeroPad from './zeroPad';

class TimeSlot extends PureComponent {
  label() {
    const { start, end, label } = this.props;
    const from = `${zeroPad(start.getHours())}:${zeroPad(start.getMinutes())}`;
    const to = `${zeroPad(end.getHours())}:${zeroPad(end.getMinutes())}`;
    const result = [from, '-', to];
    if (label) {
      result.push(' ');
      result.push(label);
    }
    return result.join('');
  }

  render() {
    const {
      start,
      end,
      availableWidth,
      frozen,
      foregroundColor,
      backgroundColor,
      width,
      offset,
    } = this.props;

    const top = positionInDay(start);
    const bottom = positionInDay(end);

    const height = bottom - top;

    const labelClasses = [styles.label];
    const labelStyle = {};
    const realAvailableWidth = availableWidth * (width || 1);
    if (height > realAvailableWidth && realAvailableWidth < 60) {
      labelClasses.push(styles.flip);
      labelStyle.width = height;
      labelStyle.marginLeft = -((height / 2) - 10);
      labelStyle.marginTop = -10;
    }

    const classes = [styles.component];
    if (frozen) {
      classes.push(styles.frozen);
    }

    const style = {
      top,
      height: bottom - top,
      backgroundColor,
      color: foregroundColor,
    };

    if (typeof width !== 'undefined' && typeof offset !== 'undefined') {
      style.width = `${width * 100}%`;
      style.left = `${offset * 100}%`;
    }

    return (
      <div
        className={classes.join(' ')}
        style={style}
      >
        <div
          className={labelClasses.join(' ')}
          style={labelStyle}
        >
          {this.label()}
        </div>
        {!frozen && (
          <div className={styles.handle}>
            ...
          </div>
        )}
      </div>
    );
  }
}

TimeSlot.propTypes = {
  start: PropTypes.instanceOf(Date).isRequired,
  end: PropTypes.instanceOf(Date).isRequired,
  availableWidth: PropTypes.number.isRequired,
  label: PropTypes.string,
  frozen: PropTypes.bool,
  foregroundColor: PropTypes.string,
  backgroundColor: PropTypes.string,

  // Props used to signal overlap
  width: PropTypes.number,
  offset: PropTypes.number,
}

export default withAvailableWidth(TimeSlot);
