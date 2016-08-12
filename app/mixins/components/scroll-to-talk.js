import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    scrollToTalk() {
      const $el = $('.Modal-dialog');

      if ($el) {
        Ember.$('.Modal').scrollTop($el.height());
      }
    }
  }
});
