import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import ShareCaching from '../../mixins/routes/share-caching';
import trackEvent from 'subtext-ui/mixins/track-event';

const { get } = Ember;

export default Ember.Route.extend(Scroll, ShareCaching, trackEvent, {
  model() {
    return this.store.createRecord('talk', {
      viewCount: 0,
      commenterCount: 1,
      commentCount: 1,
      authorName: this.get('session.currentUser.name')
    });
  },

  redirect() {
    this.transitionTo('talk.new.details');
  },

  discardRecord(model) {
    if (confirm('Are you sure you want to discard this talk?')) {
      model.destroyRecord();

      return true;
    } else {
      return false;
    }
  },

  // We can't depend on model.hasDirtyAttributes because it is always true,
  // most likely because we're mutating some values when the form loads.
  // We can check changedAttributes() instead, but need to account for
  // setting default values.
  hasDirtyAttributes(model) {
    return Object.keys(model.changedAttributes()).length > 4;
  },

  actions: {
    willTransition(transition) {
      this._super(...arguments);

      const model = get(this, 'controller.model');

      // We want to let the user continue to navigate through the new talk form
      // routes (details/promotion/preview) without discarding changes, but as
      // soon as they try to leave those pages, prompt them with the dialog.
      const isExitingForm = !transition.targetName.match(/^talk\.new/);

      if (isExitingForm && this.hasDirtyAttributes(model) && !this.discardRecord(model)) {
        transition.abort();
      }
    },

    afterDiscard(model) {
      if (!this.hasDirtyAttributes(model) || this.discardRecord(model)) {
        this.transitionTo('talk.all');

        this.trackEvent('selectNavControl', {
          navControlGroup: 'Create Content',
          navControl: 'Discard Talk Create'
        });
      }
    },

    afterDetails() {
      this.transitionTo('talk.new.promotion');
    },

    afterPromotion() {
      this.transitionTo('talk.new.preview');
    },

    afterPublish(talk) {
      this.transitionTo('talk.show', talk.get('id')).then(this.facebookRecache);
    },

    backToDetails() {
      this.transitionTo('talk.new.details');
    }
  }
});
