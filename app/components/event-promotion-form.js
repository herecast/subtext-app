import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'form',

  setCategoryEnabled: function() {
    this.set('categoryEnabled', !!this.get('category'));
  }.on('init'),

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
    {value: 'family', label: 'Family'},
    {value: 'movies', label: 'Movies'},
    {value: 'music', label: 'Music'},
    {value: 'wellness', label: 'Wellness'},
    {value: 'yardsales', label: 'Yardsales'}
  ],

  actions: {
    saveAndGoBack() {
      const event = this.get('event');

      event.save().then(() => {
        this.sendAction('backToDetails');
      });
    },

    saveAndPreview() {
      const event = this.get('event');

      event.save().then(() => {
        this.sendAction('afterPromotion');
      });
    },

    discard() {
      if (confirm('Are you sure you want to discard this event?')) {
        const event = this.get('event');
        event.destroyRecord();
        this.sendAction('afterDiscard');
      }
    }
  }
});
