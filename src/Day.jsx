import React, { Component } from 'react';

import hours from './hours';
import styles from './Day.css';

function relativeY(e) {
  const scrollableAncestor = e.target.parentNode.parentNode;
  return e.pageY - scrollableAncestor.offsetTop + scrollableAncestor.scrollTop;
}

export default class Day extends Component {
  constructor() {
    super();
    this.state = {};
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  handleMouseDown(e) {
    const start = relativeY(e);
    this.setState({
      start,
      recording: true,
      end: start + 25,
    })
  }

  handleMouseMove(e) {
    if (!this.state.recording) {
      return;
    }
    const end = relativeY(e);
    this.setState({
      end: Math.max(this.state.start + 25, end),
    });
  }

  handleMouseUp(e) {
    this.setState({
      recording: false,
    });
  }

  render() {
    const {
      start,
      end,
    } = this.state;

    return (
      <div className={styles.component}>
        {hours.map((hour) => (
          <div
            key={hour}
            className={styles.hour}
          >
            <div className={styles.halfHour}/>
          </div>
        ))}

        {start > 0 && end > 0 && (
          <div
            className={styles.currentSelection}
            style={{
              top: start,
              height: end - start,
            }}
          >
          </div>
        )}
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
