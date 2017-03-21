import Ember from 'ember';
import moment from 'moment';
import {
  validatePresence,
  validateFormat
} from 'ember-changeset-validations/validators';

const {
  isPresent,
  isEmpty
} = Ember;

export default {
  startDate: [
    validatePresence(true)
  ],

  stopDate: [
    // Is after startDate if present
    function(key, newValue, oldValue, changes) {
      const startDate = changes['startDate'];

      if(isPresent(newValue) && isPresent(startDate)) {
        const isBeforeStart = moment(newValue).isBefore(
          moment(startDate)
        );

        if(isBeforeStart) {
          return "must be after Start Date";
        }
      }

      return true;
    },
    // Is present if repeats
    function(key, newValue, oldValue, changes) {
      const repeats = changes['repeats'];

      if(isPresent(repeats) && repeats !== "once") {
        return validatePresence(true)(...arguments);
      } else {
        return true;
      }
    }
  ],

  daysOfWeek: [
    function(key, newValue, oldValue, changes) {
      const repeats = changes['repeats'];

      if(isPresent(repeats)) {
        if(repeats === 'weekly' || repeats === 'bi-weekly') {
          if(isEmpty(newValue)) {
            return "must choose at least one day of the week";
          }
        }
      }

      return true;
    }
  ],

  startTime: [
    validateFormat({
      regex: /[0-9]+:[0-9]+ am|AM|PM|pm{1}/,
      allowBlank: true
    }),
    validatePresence(true)
  ],

  stopTime: [
    validateFormat({
      regex: /[0-9]+:[0-9]+ am|AM|PM|pm{1}/,
      allowBlank: true
    }),
    function(key, newValue, oldValue, changes) {
      const startTime = changes['startTime'];

      if(isPresent(newValue) && isPresent(startTime)) {
        const isBeforeStart = moment(newValue, 'h:mm a').isBefore(
          moment(startTime, 'h:mm a')
        );

        if(isBeforeStart) {
          return "must be after Start Time";
        }
      }

      return true;
    }
  ]
};
