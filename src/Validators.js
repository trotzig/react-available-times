import { DAYS_IN_WEEK } from './Constants';

module.exports = {
  validateDays(propValue, key, componentName, location, propFullName) {
    if (!DAYS_IN_WEEK.includes(propValue[key])) {
      return new Error(`Invalid prop ${propFullName} supplied to ${componentName}. Validation failed.`);
    }
    return true;
  },
};
