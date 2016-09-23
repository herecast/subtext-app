import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    scrollToTalk() {
      const $el = this.$('.CommentSection');

      if($el.length > 0) {
        this.attrs.scrollTo($el.position().top);
      }
    }
  }
});
