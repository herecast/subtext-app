import Ember from 'ember';
import moment from 'moment';

// Used to generate a collection of records that is grouped by a specified
// date attribute. The group is split into 'headItems' and 'tailItems' which
// are used to conceal items from the page.
function buildGroup(records, dateAttr, displayFormat, convertDate) {
  const groups = new Ember.A();

  if (!Ember.isEmpty(records)) {
    records.forEach((record) => {
      const date = record.get(dateAttr);
      const value = convertDate(date);
      let group = groups.findBy('value', value);

      if (Ember.isPresent(group)) {
        Ember.get(group, 'items').pushObject(record);
      } else {
        group = Ember.Object.create({
          value: value,
          sortValue: moment(value).unix(),
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
