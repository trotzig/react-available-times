import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { HOUR_IN_PIXELS } from './Constants';
import TimeSlot from './TimeSlot';
import hours from './hours';
import positionInDay from './positionInDay';
import styles from './Day.css';
import toDate from './toDate';

const ROUND_TO_NEAREST_MINS = 5;

function relativeY(e) {
  const { offsetTop, scrollTop } = e.target.parentNode.parentNode;
  const realY = e.pageY - offsetTop + scrollTop;
  const snapTo = ROUND_TO_NEAREST_MINS / 60 * HOUR_IN_PIXELS;
  return Math.floor(realY / snapTo) * snapTo;
}

export default class Day extends Component {
  constructor() {
    super();
    this.state = {
      index: null,
      selections: [],
    };
    this.currentSelectionId = 0;
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  findSelectionAt(date) {
    for (let i = 0; i < this.state.selections.length; i++) {
      const selection = this.state.selections[i];
      if (selection.end.getTime() === date.getTime()) {
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
    const position = relativeY(e);
    const dateAtPosition = toDate(this.props.date, position);
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

    this.setState(({ selections }) => {
      return {
        edge: 'end',
        index: selections.length,
        lastKnownPosition: position,
        selections: selections.concat([{
          id: this.currentSelectionId =+ 1,
          start: dateAtPosition,
          end: toDate(this.props.date, position + HOUR_IN_PIXELS / 2),
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
        selection.start = new Date(selection.start.getTime() + diff);
        selection.end = new Date(selection.end.getTime() + diff);
      } else {
        // stretch element
        selection.end = toDate(this.props.date,
          Math.max(positionInDay(selection.start) + HOUR_IN_PIXELS / 2, position));
      }
      return {
        lastKnownPosition: position,
        selections,
      };
    })
  }

  handleMouseUp(e) {
    this.setState({
      edge: null,
      index: null,
      lastKnownPosition: null,
    });
  }

  render() {
    const {
      selections,
    } = this.state;

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
        {selections.map(({ start, end, id }, i) => (
          <TimeSlot
            key={i}
            id={id}
            start={start}
            end={end}
            onAdjustStart={this.handleAdjustStart}
            onAdjustEnd={this.handleAdjustEnd}
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
};
