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
      selections: [],
    };
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  handleMouseDown(e) {
    const start = relativeY(e);
    this.setState(({ selections }) => ({
      recording: true,
      selections: selections.concat([{
        start: toDate(this.props.date, start),
        end: toDate(this.props.date, start + HOUR_IN_PIXELS / 2),
      }]),
    }));
  }

  handleMouseMove(e) {
    if (!this.state.recording) {
      return;
    }
    const end = relativeY(e);
    this.setState(({ selections }) => {
      const last = selections[selections.length - 1];
      last.end = toDate(this.props.date,
        Math.max(positionInDay(last.start) + HOUR_IN_PIXELS / 2, end));
      return {
        selections,
      };
    })
  }

  handleMouseUp(e) {
    this.setState({
      recording: false,
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
          className={styles.mouseTarget}
        />
      </div>
    );
  }
}

Day.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
};
