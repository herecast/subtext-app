import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['ContentPreview'],

  bindScrollEvent: function() {
    this.$('.ContentPreview-scrollButton').on('click.scroll-top', () => {
      Ember.$('html,body').animate({ scrollTop: 0 }, 'slow');
    });
  }.on('didInsertElement')

});
