import { mount } from 'enzyme';
import React from 'react';

import AvailableTimes from '../src/AvailableTimes';

it('works with no props', () => {
  expect(() => mount(<AvailableTimes />)).not.toThrowError();
});
