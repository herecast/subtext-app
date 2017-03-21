import Ember from 'ember';

const {
  get
} = Ember;

export default Ember.Component.extend({
  classNames: ['DaysOfWeekInput', 'checkbox-group'],
  selectedDays: [],

  dayMap: [
    { key: 'Su', value: 1 },
    { key: 'M',  value: 2 },
    { key: 'Tu', value: 3 },
    { key: 'W',  value: 4 },
    { key: 'Th', value: 5 },
    { key: 'F',  value: 6 },
    { key: 'Sa', value: 7 }
  ],

  actions: {
    toggleDay(day, selected) {
      const selectedDays = get(this, 'selectedDays');

      if(selected) {
        get(this, 'update')(
          (selectedDays.concat([day])).uniq()
        );
      } else {
        get(this, 'update')(
          selectedDays.filter((value) => value !== day)
        );
      }
    }
  }
});
