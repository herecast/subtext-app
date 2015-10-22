import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'form',

  categoryEnabled: Ember.computed.notEmpty('event.category'),

  displayListservs: function() {
    if (Ember.isPresent(this.get('event.listservIds'))) {
      this.set('listsEnabled', true);
    }
  }.on('didInsertElement'),

  // When the user unchecks the button to add listservs, reset the array
  // so that we don't subscribe them to a list without their knowledge.
  resetListservs: function() {
    if (!this.get('listsEnabled')) {
      this.set('event.listservIds', []);
    }
  }.observes('listsEnabled'),

  categories: [
    {value: 'Movies', label: 'Movies'},
    {value: 'Performing arts', label: 'Performing arts'},
    {value: 'Wellness', label: 'Wellness'},
    {value: 'Holidays', label: 'Holidays'}
  ],

  actions: {
    back() {
      this.sendAction('backToDetails');
    },

    preview() {
      this.sendAction('afterPromotion');
    },

    discard() {
      if (confirm('Are you sure you want to discard this event?')) {
        const event = this.get('event');
        event.destroyRecord();
        this.sendAction('afterDiscard');
      }
    },

    toggleEventProperty(property) {
      this.get('event').toggleProperty(property);
    },

    toggleProperty(property) {
      this.toggleProperty(property);
    }

  }
});
