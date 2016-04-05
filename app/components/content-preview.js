import Ember from 'ember';

const { on } = Ember;

export default Ember.Component.extend({
  classNames: ['ContentPreview'],

  bindScrollEvent: on('didInsertElement', function() {
    this.$('.ContentPreview-scrollButton').on('click.scroll-top', () => {
      Ember.$('html,body').animate({ scrollTop: 0 }, 'slow');
    });
  })

});
