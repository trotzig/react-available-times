import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { HOUR_IN_PIXELS } from './Constants';
import TimeSlot from './TimeSlot';
import hasOverlap from './hasOverlap';
import hours from './hours';
import positionInDay from './positionInDay';
import styles from './Day.css';
import toDate from './toDate';

const ROUND_TO_NEAREST_MINS = 15;

function relativeY(e, rounding = ROUND_TO_NEAREST_MINS) {
  const { offsetTop, scrollTop } = e.target.parentNode.parentNode;
  const realY = e.pageY - offsetTop + scrollTop;
  const snapTo = rounding / 60 * HOUR_IN_PIXELS;
  return Math.floor(realY / snapTo) * snapTo;
}

export default class Day extends PureComponent {
  constructor({ initialSelections }) {
    super();
    this.state = {
      index: null,
      selections: initialSelections,
    };
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  findSelectionAt(date) {
    for (let i = 0; i < this.state.selections.length; i++) {
      const selection = this.state.selections[i];
      if (Math.abs(selection.end.getTime() - date.getTime()) <= 900000) {
        // Close enough to drag the trailing edge
        return { edge: 'end', index: i };
      }
      if (
        selection.start.getTime() <= date.getTime() &&
        selection.end.getTime() >= date.getTime()
      ) {
        return { edge: 'both', index: i };
      }
    }
    return {};
  }

  handleMouseDown(e) {
    let position = relativeY(e);
    let dateAtPosition = toDate(this.props.date, position);
    const { edge, index } = this.findSelectionAt(dateAtPosition);
    if (edge) {
      // We found an existing one at this position
      this.setState({
        edge,
        index,
        lastKnownPosition: position,
      });
      return;
    }

    position = relativeY(e, 60); // round to closest hour
    dateAtPosition = toDate(this.props.date, position);
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
    if (this.state.index === null) {
      return;
    }
    const position = relativeY(e);
    this.setState(({ selections, edge, index, lastKnownPosition }) => {
      const selection = selections[index];
      if (edge === 'both') {
        // move element
        const diff = toDate(this.props.date, position).getTime() -
          toDate(this.props.date, lastKnownPosition).getTime();
        const newStart = new Date(selection.start.getTime() + diff);
        const newEnd = new Date(selection.end.getTime() + diff);
        if (hasOverlap(selections, newStart, newEnd, index)) {
          return {};
        }
        selection.start = newStart;
        selection.end = newEnd;
      } else {
        // stretch element
        const newEnd = toDate(this.props.date,
          Math.max(positionInDay(selection.start) + HOUR_IN_PIXELS / 2, position));
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
    if (this.state.index === null) {
      return;
    }
    this.setState({
      edge: null,
      index: null,
      lastKnownPosition: null,
    });
    this.props.onChange(this.props.date, this.state.selections);
  }

  render() {
    const { events } = this.props;
    const { selections } = this.state;

    return (
      <div className={styles.component}>
        {hours.map((hour) => (
          <div
            key={hour}
            className={styles.hour}
            style={{ height: HOUR_IN_PIXELS }}
          >
            <div className={styles.halfHour}/>
          </div>
        ))}
        {events.map(({ color, start, end, label, width, offset }, i) => (
          <TimeSlot
            key={i + label}
            start={start}
            end={end}
            color={color}
            label={label}
            width={width}
            offset={offset}
            frozen
          />
        ))}
        {selections.map(({ start, end }, i) => (
          <TimeSlot
            key={i}
            start={start}
            end={end}
          />
        ))}
        <div
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseMove={this.handleMouseMove}
          onMouseOut={this.handleMouseUp}
          className={styles.mouseTarget}
        />
      </div>
    );
  }
}

Day.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  initialSelections: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
  })),
  events: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
    label: PropTypes.string,
    color: PropTypes.string,
    width: PropTypes.number,
    offset: PropTypes.number,
  })),
  onChange: PropTypes.func.isRequired,
};
