import Component from '@ember/component';
import { set, get } from '@ember/object';

export default Component.extend({
  isSaving: false,
  callToAction: 'Save & Publish',

  actions: {
    save() {
      set(this, 'isSaving', true);
      const post = get(this, 'model');
      const promise = post.save();

      return promise.then(() => {
        //eslint-disable-next-line ember/closure-actions
        this.sendAction('afterPublish', post);
      });
    }
  }
});
