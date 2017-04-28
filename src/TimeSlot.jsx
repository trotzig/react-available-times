import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import momentTimezone from 'moment-timezone';

import { IS_TOUCH_DEVICE } from './Constants';
import positionInDay from './positionInDay';
import styles from './TimeSlot.css';

export default class TimeSlot extends PureComponent {
  constructor() {
    super();
    this.handleResizerMouseDown = this.handleResizerMouseDown.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.preventMove = (e) => e.stopPropagation();
  }

  componentDidMount() {
    this.creationTime = new Date().getTime();
  }

  handleDelete(event) {
    if (new Date().getTime() - this.creationTime < 500) {
      // Just created. Ignore this event, as it's likely coming from the same
      // click event that created it.
      return;
    }
    event.stopPropagation();
    const { onDelete, end, start } = this.props;
    onDelete({ end, start }, event);
  }

  handleResizerMouseDown(event) {
    event.stopPropagation();
    const { onSizeChangeStart, end, start } = this.props;
    onSizeChangeStart({ end, start }, event);
  }

  handleMouseDown(event) {
    const { onMoveStart, end, start } = this.props;
    onMoveStart({ end, start }, event);
  }

  formatTime(date) {
    const { timeConvention, timeZone } = this.props;
    if (timeConvention === '12h') {
      return momentTimezone.tz(date, timeZone).format('hh:mma');
    }
    return momentTimezone.tz(date, timeZone).format('HH:mm');
  }

  title() {
    const { start, end, title } = this.props;
    const result = [this.formatTime(start), '-', this.formatTime(end)];
    if (title) {
      result.push(' ');
      result.push(title);
    }
    return result.join('');
  }

  render() {
    const {
      active,
      date,
      start,
      end,
      availableWidth,
      frozen,
      foregroundColor,
      backgroundColor,
      width,
      offset,
      timeZone,
    } = this.props;

    const top = positionInDay(date, start, timeZone);
    const bottom = positionInDay(date, end, timeZone);

    const height = bottom - top;

    const titleClasses = [styles.title];
    const titleStyle = {};
    const realAvailableWidth = availableWidth * (width || 1);
    if (height > realAvailableWidth && realAvailableWidth < 60) {
      titleClasses.push(styles.flip);
      titleStyle.width = height;
      titleStyle.marginLeft = -((height / 2) - 10);
      titleStyle.marginTop = -10;
    }

    const classes = [styles.component];
    if (frozen) {
      classes.push(styles.frozen);
    }
    if (active) {
      classes.push(styles.active);
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
        onMouseDown={frozen || IS_TOUCH_DEVICE ? undefined : this.handleMouseDown}
        onClick={frozen || !IS_TOUCH_DEVICE ? undefined : this.handleDelete}
      >
        <div
          className={titleClasses.join(' ')}
          style={titleStyle}
        >
          {this.title()}
        </div>
        {!frozen && !IS_TOUCH_DEVICE && (
          <div>
            <div
              className={styles.handle}
              onMouseDown={this.handleResizerMouseDown}
            >
              ...
            </div>
            <button
              className={styles.delete}
              onClick={this.handleDelete}
              onMouseDown={this.preventMove}
            >
              ×
            </button>
          </div>
        )}
      </div>
    );
  }
}

TimeSlot.propTypes = {
  availableWidth: PropTypes.number.isRequired,

  timeConvention: PropTypes.oneOf(['12h', '24h']),
  timeZone: PropTypes.string.isRequired,

  active: PropTypes.bool, // Whether the time slot is being changed
  date: PropTypes.instanceOf(Date).isRequired, // The day in which the slot is displayed
  start: PropTypes.instanceOf(Date).isRequired,
  end: PropTypes.instanceOf(Date).isRequired,
  title: PropTypes.string,
  frozen: PropTypes.bool,
  foregroundColor: PropTypes.string,
  backgroundColor: PropTypes.string,

  onSizeChangeStart: PropTypes.func,
  onMoveStart: PropTypes.func,
  onDelete: PropTypes.func,

  // Props used to signal overlap
  width: PropTypes.number,
  offset: PropTypes.number,
}
