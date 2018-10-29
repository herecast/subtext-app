import Component from '@ember/component';
import { get, setProperties } from '@ember/object';

const dayMapArray = [
  { key: 'Su', value: 1 },
  { key: 'M',  value: 2 },
  { key: 'Tu', value: 3 },
  { key: 'W',  value: 4 },
  { key: 'Th', value: 5 },
  { key: 'F',  value: 6 },
  { key: 'Sa', value: 7 }
];

export default Component.extend({
  classNames: ['DaysOfWeekInput', 'checkbox-group'],

  init() {
    this._super(...arguments);
    setProperties(this, {
      selectedDays: [],
      dayMap: dayMapArray,
    });
  },

  actions: {
    toggleDay(day, selected) {
      const selectedDays = get(this, 'selectedDays').sort();

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
