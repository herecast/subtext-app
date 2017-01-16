import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import ShareCaching from '../../mixins/routes/share-caching';

const { get } = Ember;

export default Ember.Route.extend(Scroll, ShareCaching, {
  model(params, transition) {
    let newRecordValues = {
      viewCount: 0,
      commenterCount: 1,
      commentCount: 1,
      authorName: this.get('session.currentUser.name')
    };

    if ('organization_id' in transition.queryParams) {
      return this.store.findRecord('organization', transition.queryParams.organization_id).then((organization) => {
        newRecordValues.organization = organization;
        return this.store.createRecord('talk', newRecordValues);
      });
    } else {
      return this.store.createRecord('talk', newRecordValues);
    }
  },

  redirect(params, transition) {
    this.transitionTo('talk.new.details', { queryParams: transition.queryParams });
  },

  // We can't depend on model.hasDirtyAttributes because it is always true,
  // most likely because we're mutating some values when the form loads.
  // We can check changedAttributes() instead, but need to account for
  // setting default values.
  hasDirtyAttributes(model) {
    return Object.keys(model.changedAttributes()).length > 4;
  },

  attemptDiscard(event, transition) {
    const confirmed = confirm('Are you sure you want to discard this talk?');

    if (confirmed) {
      event.destroyRecord();
    } else {
      transition.abort();
    }
  },

  actions: {
    willTransition(transition) {
      this._super(...arguments);

      const talk = get(this, 'controller.model');

      // We want to let the user continue to navigate through the new talk form
      // routes (details/promotion/preview) without discarding changes, but as
      // soon as they try to leave those pages, prompt them with the dialog.
      const isExitingForm = !transition.targetName.match(/^talk\.new/);

      if (isExitingForm && this.hasDirtyAttributes(talk)) {
        this.attemptDiscard(talk, transition);
      }
    },

    afterDiscard() {
      this.transitionTo('talk.all').then(() => {
      });
    },

    afterDetails() {
      this.transitionTo('talk.new.promotion');
    },

    afterPromotion() {
      this.transitionTo('talk.new.preview');
    },

    afterPublish(talk) {
      this.transitionTo('talk.all.show', talk.get('id'));
    },

    backToDetails() {
      this.transitionTo('talk.new.details');
    }
  }
});
