import Ember from 'ember';

const { $ } = Ember;

export default Ember.Mixin.create({
  actions: {
    scrollToTalk() {
      const $el = $('.Modal-dialog');

      if ($el) {
        $('.Modal').scrollTop($el.height());
      }
    }
  }
});
