# React Available Times

A React component that allows a user to select time-slots in a calendar-like UI.

![Demo](/available-times-demo.gif)

## Installation
```
npm install --save react-available-times
```

## Usage

```jsx
import AvailableTimes from 'react-available-times';

<AvailableTimes
  calendars={[
    {
      id: 'work',
      title: 'Work',
      foregroundColor: '#ff00ff',
      backgroundColor: '#f0f0f0',
      selected: true,
    },
    {
      id: 'private',
      title: 'My private cal',
      foregroundColor: '#666',
      backgroundColor: '#f3f3f3',
    },
  ]}
  onChange={(selections) => {
    selections.forEach(({ start, end }) => {
      console.log('Start:', start, 'End:', end);
    })
  }}
  onCalendarSelected={(calendarIds) => {
    // e.g. ['work', 'private']
  }}
  initialSelections={[
    { start: aDateObject, end: anotherDateObject }
  ]}
  events={[
    { start: aDateObject, end: anotherDateObject, title: 'Some title', calendarId: 'work' },
    { start: aDateObject, end: anotherDateObject, title: 'Some other title', calendarId: 'private' }
  ]}
  start={new Date()}
  height={400}
/>
```

## Props

None of the props are required.

- `calendars`: a list of calendars displayed in the dropdown at the top right.
- `onChange`: a function called whenever a selection is made. Receives an array
  of objects, each with a `start` and an `end` date.
- `onCalendarSelected`: a function called when the user is changing the
  filtering of calendars. Useful if you want to lazy-load a set of events. Gets
  called with a list of the calendar ids currently selected.
- `initialSelections`: an array of pre-filled selections. Each object in the
  array needs a `start` and an `end` date.
- `events`: calendar events, usually pulled from a different source (e.g. a
  Google Calendar). Each object needs a `start` and an `end` date, plus a
  `title` property. Can have a `calendarId` property tying them to a calendar,
  inheriting the foreground and background color.
- `start`: a date signalling the week you want to display to begin with. Can be
  any day within the week.
- `height`: a string or a number controlling the `height` of the component.
  E.g. `'100%'`, `350`, `'100vh'`. If left out, the full height of the screen
  will be used.

## Contributing

First, run `npm install` to install all dependencies. Then, to manually test
the component, run `npm run start-test` and open `http://localhost:3333/` in a
browser.

Unit tests are run with [jest](https://facebook.github.io/jest/). Run `npm run
test -- --watch` to run tests.
