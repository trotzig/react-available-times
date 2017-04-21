import PropTypes from 'prop-types';
import React, { Children, PureComponent } from 'react';

import styles from './Slider.css';

export default class Slider extends PureComponent {
  render() {
    const {
      children,
      index,
      onSlide,
    } = this.props;

    return (
      <div className={styles.component}>
        {Children.toArray(children).map((child, i) => {
          let translate = '0';
          if (i - index > 0) {
            translate = '100%';
          } else if (i - index < 0) {
            translate = '-100%';
          }
          return (
            <div
              key={i}
              className={styles.item}
              style={{
                transform: `translateX(${translate})`,
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
};
