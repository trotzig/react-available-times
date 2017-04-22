import React, { PureComponent } from 'react';

import styles from './CalendarSelector.css';

export default class CalendarSelector extends PureComponent {
  constructor() {
    super();
    this.state = {
      open: false,
    };
    this.toggleOpen = this.toggleOpen.bind(this);
    this.check = this.toggleCalendar.bind(this, true);
    this.uncheck = this.toggleCalendar.bind(this, false);
    this.renderCalendar = this.renderCalendar.bind(this)
  }

  toggleOpen() {
    this.setState(({ open }) => ({ open: !open }));
  }

  toggleCalendar(visible, event) {
    const {
      visibleCalendars,
      onChange,
    } = this.props;
    const result = new Set(visibleCalendars);
    if (visible) {
      result.add(event.target.value);
    } else {
      result.delete(event.target.value);
    }
    onChange(result);
  }

  renderCalendar({
    id,
    displayName,
    foregroundColor,
    backgroundColor,
  }) {
    const {
      visibleCalendars,
    } = this.props;

    const checked = visibleCalendars.has(id);

    return (
      <label
        key={id}
        style={{
          color: foregroundColor,
          backgroundColor,
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          value={id}
          onChange={checked ? this.uncheck : this.check}
        />
        {displayName}
      </label>
    );
  }

  render() {
    const {
      calendars,
      visibleCalendars,
      onChange,
    } = this.props;

    return (
      <div className={styles.component}>
        <button onClick={this.toggleOpen}>
          Calendars
        </button>
        {this.state.open &&
          <div className={styles.menu}>
            {calendars.map(this.renderCalendar)}
          </div>
        }
      </div>
    );
  }
}
