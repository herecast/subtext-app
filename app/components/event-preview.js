import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['EventPreview'],

  bindScrollEvent: function() {
    this.$('.EventPreview-scrollButton').on('click.scroll-top', () => {
      Ember.$('html,body').animate({ scrollTop: 0 }, 'slow');
    });
  }.on('didInsertElement')

});
