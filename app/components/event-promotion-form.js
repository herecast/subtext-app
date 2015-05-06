import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'form',

  setCategoryEnabled: function() {
    this.set('categoryEnabled', !!this.get('category'));
  }.on('init'),

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
