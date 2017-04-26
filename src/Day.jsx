import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { HOUR_IN_PIXELS, IS_TOUCH_DEVICE } from './Constants';
import TimeSlot from './TimeSlot';
import hasOverlap from './hasOverlap';
import positionInDay from './positionInDay';
import styles from './Day.css';
import toDate from './toDate';

const ROUND_TO_NEAREST_MINS = 15;

function relativeY(e, rounding = ROUND_TO_NEAREST_MINS) {
  return relativeYElement(e, e.target, rounding);
}

function relativeYElement(e, element, rounding = ROUND_TO_NEAREST_MINS) {
  const { top } = element.getBoundingClientRect();
  const realY = (e.pageY || e.touches[0].pageY) - top;
  const snapTo = rounding / 60 * HOUR_IN_PIXELS;
  return Math.floor(realY / snapTo) * snapTo;
}

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
    this.handleMouseTargetRef = (element) => this.mouseTargetRef = element;
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
  }

  handleDelete({ start, end }) {
    const { onChange } = this.props;

    this.setState(({ selections }) => {
      for (let i = 0; i < selections.length; i++) {
        if (selections[i].start === start && selections[i].end === end) {
          selections.splice(i, 1);
          this.props.onChange(this.props.date, selections);
          return { selections: selections.slice(0) };
        }
      }
      return {};
    });
  }

  handleItemModification(edge, { start, end }, event) {
    const position = relativeYElement(event, this.mouseTargetRef);
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

  handleTouchEnd(e) {
    const { startY, currentY, startX, currentX } = this.touch;
    if (
      Math.abs(startX - (currentX || startX)) < 20 &&
      Math.abs(startY - (currentY || startY)) < 20
    ) {
      e.pageY = startY;
      e.pageX = startX;
      this.handleMouseDown(e);
      this.handleMouseUp(e);
    }
    this.touch = undefined;
  }

  handleMouseDown(e) {
    const position = relativeY(e, 60);
    const dateAtPosition = toDate(this.props.date, position);

    if (this.findSelectionAt(dateAtPosition)) {
      return;
    }

    let end = toDate(this.props.date, position + HOUR_IN_PIXELS);
    end = hasOverlap(this.state.selections, dateAtPosition, end) || end;
    if (end - dateAtPosition < 1800000) {
      // slot is less than 30 mins
      return;
    }
    this.setState(({ selections }) => {
      return {
        edge: 'end',
        index: selections.length,
        lastKnownPosition: position,
        selections: selections.concat([{
          start: dateAtPosition,
          end,
        }]),
      };
    });
  }

  handleMouseMove(e) {
    if (typeof this.state.index === 'undefined') {
      return;
    }
    const { date } = this.props;
    const position = relativeY(e);
    this.setState(({ selections, edge, index, lastKnownPosition }) => {
      const selection = selections[index];
      if (edge === 'both') {
        // move element
        const diff = toDate(date, position).getTime() -
          toDate(date, lastKnownPosition).getTime();
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
          date, selection.start) + HOUR_IN_PIXELS / 2, position));
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
    })
  }

  handleMouseUp(e) {
    if (typeof this.state.index === 'undefined') {
      return;
    }
    this.setState({
      edge: undefined,
      index: undefined,
      lastKnownPosition: undefined,
    });
    this.props.onChange(this.props.date, this.state.selections);
  }

  render() {
    const { availableWidth, date, events, timeConvention } = this.props;
    const { selections, index } = this.state;

    const classes = [styles.component];
    if (date.toDateString() === new Date().toDateString()) {
      classes.push(styles.today);
    }

    return (
      <div
        className={classes.join(' ')}
        style={{ height: HOUR_IN_PIXELS * 24 }}
      >
        {events.map(({
          allDay,
          foregroundColor,
          backgroundColor,
          start,
          end,
          title,
          width,
          offset,
        }, i) => !allDay && (
          <TimeSlot
            key={i + title}
            timeConvention={timeConvention}
            availableWidth={availableWidth}
            date={date}
            start={start}
            end={end}
            foregroundColor={foregroundColor}
            backgroundColor={backgroundColor}
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
            key={i}
            availableWidth={availableWidth}
            timeConvention={timeConvention}
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

  date: PropTypes.instanceOf(Date).isRequired,
  initialSelections: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
  })),
  events: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
    title: PropTypes.string,
    foregroundColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    width: PropTypes.number,
    offset: PropTypes.number,
  })),
  onChange: PropTypes.func.isRequired,
};
