import Ember from 'ember';

const ConcealedGroup = Ember.Object.extend({
  groupHeadCount: 8,
  value: null,
  displayValue: null,
  items: [],
  tailHidden: true,
  hasTailItems: Ember.computed.gt('tailItems.length', 0),
  hasHiddenTailItems: Ember.computed.and('hasTailItems', 'tailHidden'),

  headItems: function() {
    return this.get('items').slice(0, this.get('groupHeadCount'));
  }.property('items.[]'),

  tailItems: function() {
    return this.get('items').slice(this.get('groupHeadCount'));
  }.property('items.[]')
});

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
        group = ConcealedGroup.create({
          value: value,
          displayValue: date.format(displayFormat),
          paramValue: date.format('YYYY-MM-DD'),
          items: [record]
        });

        groups.push(group);
      }
    });
  }

  return groups.sortBy('value');
}

export {
  buildGroup
};
