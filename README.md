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
      displayName: 'Work',
      foregroundColor: '#ff00ff',
      backgroundColor: '#f0f0f0',
    },
    {
      id: 'private',
      displayName: 'My private cal',
      foregroundColor: '#666',
      backgroundColor: '#f3f3f3',
    },
  ]}
  initialVisibleCalendars={['work', 'private']}
  onChange={(selections) => {
    selections.forEach(({ start, end }) => {
      console.log('Start:', start, 'End:', end);
    })
  }}
  initialSelections={[
    { start: aDateObject, end: anotherDateObject }
  ]}
  events={[
    { start: aDateObject, end: anotherDateObject, label: 'Some label', calendar: 'work' },
    { start: aDateObject, end: anotherDateObject, label: 'Some other label', calendar: 'private' }
  ]}
  start={new Date()}
  height={400}
/>
```

## Props

None of the props are required.

- `calendars`: a list of calendars displayed in the dropdown at the top right.
- `initialVisibleCalendars`: a list of calendar ids that should be shown at
  mount.
- `onChange`: a function called whenever a selection is made. Receives an array
  of objects, each with a `start` and an `end` date.
- `initialSelections`: an array of pre-filled selections. Each object in the
  array needs a `start` and an `end` date.
- `events`: calendar events, usually pulled from a different source (e.g. a
  Google Calendar). Each object needs a `start` and an `end` date, plus a
  `label` property. Can have a `calendar` property tying them to a calendar,
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
