import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { HOUR_IN_PIXELS, IS_TOUCH_DEVICE } from './Constants';
import TimeSlot from './TimeSlot';
import hasOverlap from './hasOverlap';
import inSameDay from './inSameDay';
import positionInDay from './positionInDay';
import styles from './Day.css';
import toDate from './toDate';

const ROUND_TO_NEAREST_MINS = 15;

export default class Day extends PureComponent {
  constructor({ initialSelections }) {
    super();
    this.state = {
      index: undefined,
      selections: initialSelections,
    };
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleSizeChangeStart = this.handleItemModification.bind(this, 'end');
    this.handleMoveStart = this.handleItemModification.bind(this, 'both');
    this.handleDelete = this.handleDelete.bind(this);
    this.handleMouseTargetRef = element => (this.mouseTargetRef = element);
  }

  findSelectionAt(date) {
    const { selections } = this.state;
    for (let i = 0; i < selections.length; i++) {
      const selection = selections[i];
      if (
        selection.start.getTime() <= date.getTime() &&
        selection.end.getTime() > date.getTime()
      ) {
        return true;
      }
    }
    return undefined;
  }

  relativeY(pageY, rounding = ROUND_TO_NEAREST_MINS) {
    const { top } = this.mouseTargetRef.getBoundingClientRect();
    const realY = pageY - top;
    const snapTo = (rounding / 60) * HOUR_IN_PIXELS;
    return Math.floor(realY / snapTo) * snapTo;
  }


  handleDelete({ start, end }) {
    const { onChange, index } = this.props;

    this.setState(({ selections }) => {
      for (let i = 0; i < selections.length; i++) {
        if (selections[i].start === start && selections[i].end === end) {
          selections.splice(i, 1);
          onChange(index, selections);
          return { selections: selections.slice(0) };
        }
      }
      return {};
    });
  }

  handleItemModification(edge, { start, end }, { pageY }) {
    const position = this.relativeY(pageY);
    this.setState(({ selections }) => {
      for (let i = 0; i < selections.length; i++) {
        if (selections[i].start === start && selections[i].end === end) {
          return {
            edge,
            index: i,
            lastKnownPosition: position,
          };
        }
      }
      return {};
    });
  }

  handleTouchStart(e) {
    this.touch = {
      startY: e.touches[0].pageY,
      startX: e.touches[0].pageX,
    };
  }

  handleTouchMove(e) {
    this.touch.currentY = e.touches[0].pageY;
    this.touch.currentX = e.touches[0].pageX;
  }

  handleTouchEnd() {
    const { startY, currentY, startX, currentX } = this.touch;
    if (
      Math.abs(startX - (currentX || startX)) < 20 &&
      Math.abs(startY - (currentY || startY)) < 20
    ) {
      this.handleMouseDown({ pageY: startY });
      this.handleMouseUp();
    }
    this.touch = undefined;
  }

  handleMouseDown(e) {
    const { timeZone } = this.props;
    const position = this.relativeY(e.pageY, 60);
    const dateAtPosition = toDate(this.props.date, position, timeZone);

    if (this.findSelectionAt(dateAtPosition)) {
      return;
    }

    let end = toDate(this.props.date, position + HOUR_IN_PIXELS, timeZone);
    end = hasOverlap(this.state.selections, dateAtPosition, end) || end;
    if (end - dateAtPosition < 1800000) {
      // slot is less than 30 mins
      return;
    }
    this.setState(({ selections }) => ({
      edge: 'end',
      index: selections.length,
      lastKnownPosition: position,
      selections: selections.concat([{
        start: dateAtPosition,
        end,
      }]),
    }));
  }

  handleMouseMove({ pageY }) {
    if (typeof this.state.index === 'undefined') {
      return;
    }
    const { date, timeZone } = this.props;
    const position = this.relativeY(pageY);
    this.setState(({ selections, edge, index, lastKnownPosition }) => {
      const selection = selections[index];
      if (edge === 'both') {
        // move element
        const diff = toDate(date, position, timeZone).getTime() -
          toDate(date, lastKnownPosition, timeZone).getTime();
        const newStart = new Date(selection.start.getTime() + diff);
        const newEnd = new Date(selection.end.getTime() + diff);
        if (hasOverlap(selections, newStart, newEnd, index)) {
          return {};
        }
        selection.start = newStart;
        selection.end = newEnd;
      } else {
        // stretch element
        const newEnd = toDate(date, Math.max(positionInDay(
          date, selection.start, timeZone) + (HOUR_IN_PIXELS / 2), position), timeZone);
        if (hasOverlap(selections, selection.start, newEnd, index)) {
          // Collision! Let
          return {};
        }
        selection.end = newEnd;
      }
      return {
        lastKnownPosition: position,
        selections,
      };
    });
  }

  handleMouseUp() {
    if (typeof this.state.index === 'undefined') {
      return;
    }
    this.setState({
      edge: undefined,
      index: undefined,
      lastKnownPosition: undefined,
    });
    this.props.onChange(this.props.index, this.state.selections);
  }

  render() {
    const { availableWidth, date, events, timeConvention, timeZone } = this.props;
    const { selections, index } = this.state;

    const classes = [styles.component];
    if (inSameDay(date, new Date(), timeZone)) {
      classes.push(styles.today);
    }

    return (
      <div
        className={classes.join(' ')}
        style={{
          height: HOUR_IN_PIXELS * 24,
          width: availableWidth,
        }}
      >
        {events.map(({
          allDay,
          start,
          end,
          title,
          width,
          offset,
        }, i) => !allDay && (
          <TimeSlot
            // eslint-disable-next-line react/no-array-index-key
            key={i + title}
            timeConvention={timeConvention}
            timeZone={timeZone}
            date={date}
            start={start}
            end={end}
            title={title}
            width={width}
            offset={offset}
            frozen
          />
        ))}
        <div
          onMouseDown={IS_TOUCH_DEVICE ? undefined : this.handleMouseDown}
          onMouseUp={IS_TOUCH_DEVICE ? undefined : this.handleMouseUp}
          onMouseMove={IS_TOUCH_DEVICE ? undefined : this.handleMouseMove}
          onMouseOut={IS_TOUCH_DEVICE ? undefined : this.handleMouseUp}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          className={styles.mouseTarget}
          ref={this.handleMouseTargetRef}
        />
        {selections.map(({ start, end }, i) => (
          <TimeSlot
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            timeConvention={timeConvention}
            timeZone={timeZone}
            date={date}
            start={start}
            end={end}
            active={typeof index !== 'undefined'}
            onSizeChangeStart={this.handleSizeChangeStart}
            onMoveStart={this.handleMoveStart}
            onDelete={this.handleDelete}
          />
        ))}
      </div>
    );
  }
}

Day.propTypes = {
  availableWidth: PropTypes.number.isRequired,
  timeConvention: PropTypes.oneOf(['12h', '24h']),
  timeZone: PropTypes.string.isRequired,

  date: PropTypes.instanceOf(Date).isRequired,
  index: PropTypes.number.isRequired,
  initialSelections: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
  })),
  events: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
    title: PropTypes.string,
    width: PropTypes.number,
    offset: PropTypes.number,
  })),
  onChange: PropTypes.func.isRequired,
};
