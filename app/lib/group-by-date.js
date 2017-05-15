import Ember from 'ember';
import moment from 'moment';

// Used to generate a collection of records that is grouped by a specified
// date attribute. The group is split into 'headItems' and 'tailItems' which
// are used to conceal items from the page.
function buildGroup(records, dateAttr, displayFormat, convertDate) {
  const groups = new Ember.A();

  if (!Ember.isEmpty(records)) {
    records.forEach((record, index) => {
      const date = record.get(dateAttr);
      const value = convertDate(date);
      let group = groups.findBy('value', value);

      Ember.set(record, 'indexInFullSetOfRecords', index);

      if (Ember.isPresent(group)) {
        Ember.get(group, 'items').pushObject(record);
      } else {
        // When viewing a single day, the value will be the hour of the day.
        // When viewing events across multiple days, the value is the date.
        const sortValue = parseInt(value) === value ? value : moment(value).unix();

        group = Ember.Object.create({
          value: value,
          sortValue: sortValue,
          displayValue: date.format(displayFormat),
          paramValue: date.format('YYYY-MM-DD'),
          items: [record]
        });

        groups.push(group);
      }
    });
  }

  return groups.sortBy('sortValue');
}

export {
  buildGroup
};
