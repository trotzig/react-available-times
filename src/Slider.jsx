import PropTypes from 'prop-types';
import React, { Children, PureComponent } from 'react';

import styles from './Slider.css';

const THRESHOLD_PERCENT = 15;

export default class Slider extends PureComponent {
  constructor() {
    super();
    this.state = {
      offsetX: 0,
    };
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleRef = this.handleRef.bind(this);
  }

  getTranslateValue(i) {
    const { index } = this.props;
    const percentage = this.percentage();
    if (i === index) {
      return percentage;
    }
    if (i - index === 1) {
      // next week
      return 100 + percentage;
    }
    if (index - i === 1) {
      // previous week
      return -100 + percentage;
    }
    if (i - index > 0) {
      return 100;
    }
    if (i - index < 0) {
      return -100;
    }
    return undefined;
  }

  percentage() {
    const { offsetX } = this.state;
    return offsetX !== 0 ? (offsetX / this.width) * 100 : 0;
  }

  handleRef(element) {
    this.width = element.offsetWidth;
  }

  handleTouchStart(event) {
    if (this.props.disabled) {
      return;
    }
    this.setState({
      startX: event.touches[0].pageX,
    });
  }

  handleTouchMove(event) {
    if (this.props.disabled) {
      return;
    }
    const x = event.touches[0].pageX;
    this.setState(({ startX }) => ({
      offsetX: x - startX,
    }));
  }

  handleTouchEnd() {
    if (this.props.disabled) {
      return;
    }
    const percentage = this.percentage();
    if (Math.abs(percentage) > THRESHOLD_PERCENT) {
      this.props.onSlide(percentage < 0 ? 1 : -1);
    }
    this.setState({
      offsetX: 0,
      startX: undefined,
    });
  }

  render() {
    const {
      children,
    } = this.props;

    return (
      <div
        className={styles.component}
        ref={this.handleRef}
      >
        {Children.toArray(children).map((child, i) => {
          const translate = this.getTranslateValue(i);
          return (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className={styles.item}
              onTouchStart={this.handleTouchStart}
              onTouchMove={this.handleTouchMove}
              onTouchEnd={this.handleTouchEnd}
              style={{
                transform: `translateX(${translate}%)`,
              }}
            >
              {child}
            </div>
          );
        })}
      </div>
    );
  }
}

Slider.propTypes = {
  index: PropTypes.number,
  children: PropTypes.node,
  onSlide: PropTypes.func,
  disabled: PropTypes.bool,
};
