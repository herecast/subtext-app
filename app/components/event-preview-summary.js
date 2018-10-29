import { get, set } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  isSaving: false,
  callToAction: 'Save & Publish',

  actions: {
    save() {
      set(this, 'isSaving', true);

      const event = get(this, 'model');
      const promise = event.save();

      return promise.then((savedEvent) => {
        //eslint-disable-next-line ember/closure-actions
        this.sendAction('afterPublish', savedEvent);
      });
    }
  }
});
