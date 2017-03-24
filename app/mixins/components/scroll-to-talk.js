import Ember from 'ember';

const { get } = Ember;

export default Ember.Mixin.create({
  actions: {
    scrollToTalk() {
      const $el = this.$('.CommentSection');

      if($el.length > 0) {
        const scrollTo = get(this, 'scrollTo');
        if (scrollTo) {
          scrollTo($el.position().top);
        }
      }
    }
  }
});
