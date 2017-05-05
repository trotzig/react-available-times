/* eslint-disable jsx-a11y/no-static-element-interactions */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import styles from './CalendarSelector.css';

const downIconSvg = (
  <svg height="24" viewBox="0 0 24 24" width="24">
    <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" />
    <path d="M0-.75h24v24H0z" fill="none" />
  </svg>
);

const checkmarkSvg = (
  <svg height="24" viewBox="0 0 24 24" width="24">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

export default class CalendarSelector extends PureComponent {
  constructor() {
    super();
    this.state = {
      open: false,
    };
    this.toggleOpen = this.toggleOpen.bind(this);
    this.check = this.toggleCalendar.bind(this, true);
    this.uncheck = this.toggleCalendar.bind(this, false);
    this.renderCalendar = this.renderCalendar.bind(this);
  }

  toggleOpen(event) {
    event.stopPropagation();
    this.setState(({ open }) => ({ open: !open }));
  }

  toggleCalendar(visible, event) {
    const {
      selectedCalendars,
      onChange,
    } = this.props;
    const result = selectedCalendars.slice(0);
    if (visible) {
      result.push(event.target.value);
    } else {
      result.splice(result.indexOf(event.target.value), 1);
    }
    onChange(result);
  }

  renderCalendar({
    id,
    title,
    foregroundColor,
    backgroundColor,
  }) {
    const {
      selectedCalendars,
    } = this.props;

    const checked = selectedCalendars.indexOf(id) !== -1;

    return (
      // eslint-disable-next-line jsx-a11y/label-has-for
      <label
        key={id}
        className={styles.calendar}
        style={{
        }}
      >
        <input
          className={styles.checkbox}
          type="checkbox"
          checked={checked}
          value={id}
          onChange={checked ? this.uncheck : this.check}
          style={{ display: 'none' }}
        />
        <div
          className={styles.box}
          style={{
            fill: foregroundColor,
            backgroundColor,
          }}
        >
          {checked && checkmarkSvg}
        </div>
        <div
          title={title}
          className={styles.calendarTitle}
        >
          {title}
        </div>
      </label>
    );
  }

  render() {
    const {
      calendars,
    } = this.props;

    return (
      <div className={styles.component}>
        <button
          className={styles.button}
          onClick={this.toggleOpen}
        >
          <span>Calendars</span>
          {downIconSvg}
        </button>
        {this.state.open &&
          <div className={styles.modal}>
            <div
              className={styles.clickTarget}
              onClick={this.toggleOpen}
              onTouchStart={this.toggleOpen}
            />
            <div className={styles.menu}>
              {calendars.map(this.renderCalendar)}
            </div>
          </div>
        }
      </div>
    );
  }
}

CalendarSelector.propTypes = {
  calendars: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedCalendars: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};
