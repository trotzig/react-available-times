import React, { Component } from 'react';

import { HOUR_IN_PIXELS } from './Constants';
import hours from './hours';
import styles from './Day.css';

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
    this.setState(({ selections }) => {
      return {
        recording: true,
        selections: selections.concat([{
          start,
          end: start + HOUR_IN_PIXELS / 2,
        }]),
      }
    });
  }

  handleMouseMove(e) {
    if (!this.state.recording) {
      return;
    }
    const end = relativeY(e);
    this.setState(({ selections }) => {
      const last = selections[selections.length - 1];
      last.end = Math.max(last.start + HOUR_IN_PIXELS / 2, end);
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
          <div
            key={i}
            className={styles.currentSelection}
            style={{
              top: start,
              height: end - start,
            }}
          >
          </div>
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
