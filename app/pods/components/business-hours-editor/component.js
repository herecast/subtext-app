import Ember from 'ember';
import bizHours from '../../../utils/business-hours';

const {
  isPresent,
  get, set
} = Ember;

function extractDaysOpen(data) {
  let days = [];
  for(var key in data) {
    if (data.hasOwnProperty(key)) {
      days.push(key);
    }
  }
  return days;
}

function extractOpenTimes(data) {
  let openTimes = {};
  for(var key in data) {
    if (data.hasOwnProperty(key)) {
      openTimes[key] = data[key].open;
    }
  }
  return openTimes;
}

function extractCloseTimes(data) {
  let closeTimes = {};
  for(var key in data) {
    if (data.hasOwnProperty(key)) {
      closeTimes[key] = data[key].close;
    }
  }
  return closeTimes;
}

export default Ember.Component.extend({
  model: [],
  availableTimes: [
    {value: '00:00', label: '12:00 AM'},
    {value: '00:30', label: '12:30 AM'},
    {value: '01:00', label: '1:00 AM'},
    {value: '01:30', label: '1:30 AM'},
    {value: '02:00', label: '2:00 AM'},
    {value: '02:30', label: '2:30 AM'},
    {value: '03:00', label: '3:00 AM'},
    {value: '03:30', label: '3:30 AM'},
    {value: '04:00', label: '4:00 AM'},
    {value: '04:30', label: '4:30 AM'},
    {value: '05:00', label: '5:00 AM'},
    {value: '05:30', label: '5:30 AM'},
    {value: '06:00', label: '6:00 AM'},
    {value: '06:30', label: '6:30 AM'},
    {value: '07:00', label: '7:00 AM'},
    {value: '07:30', label: '7:30 AM'},
    {value: '08:00', label: '8:00 AM'},
    {value: '08:30', label: '8:30 AM'},
    {value: '09:00', label: '9:00 AM'},
    {value: '09:30', label: '9:30 AM'},
    {value: '10:00', label: '10:00 AM'},
    {value: '10:30', label: '10:30 AM'},
    {value: '11:00', label: '11:00 AM'},
    {value: '11:30', label: '11:30 AM'},
    {value: '12:00', label: '12:00 PM'},
    {value: '12:30', label: '12:30 PM'},
    {value: '13:00', label: '1:00 PM'},
    {value: '13:30', label: '1:30 PM'},
    {value: '14:00', label: '2:00 PM'},
    {value: '14:30', label: '2:30 PM'},
    {value: '15:00', label: '3:00 PM'},
    {value: '15:30', label: '3:30 PM'},
    {value: '16:00', label: '4:00 PM'},
    {value: '16:30', label: '4:30 PM'},
    {value: '17:00', label: '5:00 PM'},
    {value: '17:30', label: '5:30 PM'},
    {value: '18:00', label: '6:00 PM'},
    {value: '18:30', label: '6:30 PM'},
    {value: '19:00', label: '7:00 PM'},
    {value: '19:30', label: '7:30 PM'},
    {value: '20:00', label: '8:00 PM'},
    {value: '20:30', label: '8:30 PM'},
    {value: '21:00', label: '9:00 PM'},
    {value: '21:30', label: '9:30 PM'},
    {value: '22:00', label: '10:00 PM'},
    {value: '22:30', label: '10:30 PM'},
    {value: '23:00', label: '11:00 PM'},
    {value: '23:30', label: '11:30 PM'}
  ],
  daysOfTheWeek: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],

  didReceiveAttrs() {
    this._super(...arguments);
    const hoursObj = bizHours.deserialize(get(this, 'hours') || []);

    set(this, 'model', hoursObj);
    set(this, 'daysOpen', extractDaysOpen(hoursObj));
    set(this, 'openTimes', extractOpenTimes(hoursObj));
    set(this, 'closeTimes', extractCloseTimes(hoursObj));
  },

  triggerUpdate() {
    const model = get(this, 'model');
    const serializedModel = bizHours.serialize(model);

    const onUpdate = get(this, 'on-update');
    if (onUpdate) {
      onUpdate(serializedModel);
    }
  },

  actions: {
    updateOpen(day, value) {
      const model = get(this, 'model');

      model[day] = model[day] || {open: "00:00", close: "00:00"};
      model[day].open = value;

      this.triggerUpdate();
    },

    updateClose(day, value) {
      const model = get(this, 'model');

      model[day] = model[day] || {open: "00:00", close: "00:00"};
      model[day].close = value;

      this.triggerUpdate();
    },

    toggleOpen(day) {
      const model = get(this, 'model');

      if(isPresent(model[day])) {
        delete model[day];
      } else {
        model[day] = {open: "00:00", close: "00:00"};
      }

      this.triggerUpdate();
    }
  }
});
