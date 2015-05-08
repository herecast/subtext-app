import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  selectedIds: [],

  click() {
    const input = this.$('input');
    const value = parseInt(input.val());

    if (input.is(':checked')) {
      this.get('selectedIds').pushObject(value);
    } else {
      this.get('selectedIds').removeObject(value);
    }
  },

  checked: function() {
    return this.get('selectedIds').indexOf(this.get('listserv.id')) > - 1;
  }.property('listserv', 'selectedIds.[]')
});
