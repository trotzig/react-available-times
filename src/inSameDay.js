import momentTimezone from 'moment-timezone';

export default function inSameDay(dateA, dateB, timeZone) {
  return momentTimezone.tz(dateA, timeZone).format('YYYYMMDD') ===
      momentTimezone.tz(dateB, timeZone).format('YYYYMMDD');
}
