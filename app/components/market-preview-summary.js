import Ember from 'ember';

const {
  get,
  set,
  inject
} = Ember;

export default Ember.Component.extend({
  isSaving: false,
  callToAction: 'Save & Publish',

  intercom: inject.service('intercom'),

  actions: {
    save(callback) {
      set(this, 'isSaving', true);
      const post = get(this, 'model');
      const isNew = get(post, 'isNew');

      const promise = post.save();

      callback(promise);

      promise.then(() => {
        const wasNew = isNew;
        const metadata = {
          'reverse-publish': (get(post, 'listservIds.length') > 0)
        };

        if (wasNew) {
          get(this, 'intercom').trackEvent('market-publish', metadata);
        }

        this.sendAction('afterPublish', post);
      });
    }
  }
});
