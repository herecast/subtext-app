import Ember from 'ember';
import moment from 'moment';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ShareCaching from '../../mixins/routes/share-caching';
import trackEvent from 'subtext-ui/mixins/track-event';

const { get, run } = Ember;

export default Ember.Route.extend(Scroll, Authorized, ShareCaching, trackEvent, {

  model(params, transition) {
    const newRecordValues = {
      publishedAt: moment()
    };

    if ('organization_id' in transition.queryParams) {
      return this.store.findRecord('organization', transition.queryParams.organization_id).then((organization) => {
        newRecordValues.organization = organization;
        return this.store.createRecord('market-post', newRecordValues);
      });
    } else {
      return this.store.createRecord('market-post', newRecordValues);
    }
  },

  redirect(params, transition) {
    this.transitionTo('market.new.details', { queryParams: transition.queryParams });
  },

  discardRecord(model) {
    if (confirm('Are you sure you want to discard this post?')) {
      model.destroyRecord();

      return true;
    } else {
      return false;
    }
  },

  // We can't depend on model.hasDirtyAttributes because it is always true,
  // most likely because we're mutating some values when the form loads.
  // We can check changedAttributes() instead, but need to account for
  // setting a default publishedAt value.
  hasDirtyAttributes(model) {
    return Object.keys(model.changedAttributes()).length > 1;
  },

  actions: {
    willTransition(transition) {
      this._super(...arguments);

      const model = get(this, 'controller.model');

      // We want to let the user continue to navigate through the new post form
      // routes (details/promotion/preview) without discarding changes, but as
      // soon as they try to leave those pages, prompt them with the dialog.
      const isExitingForm = !transition.targetName.match(/^market\.new/);

      if (isExitingForm && this.hasDirtyAttributes(model) && !this.discardRecord(model)) {
        transition.abort();
      }
    },

    afterDiscard(model) {
      if (!this.hasDirtyAttributes(model) || this.discardRecord(model)) {
        this.transitionTo('market.all');

        this.trackEvent('selectNavControl', {
          navControlGroup: 'Create Content',
          navControl: 'Discard Market Listing Create'
        });
      }
    },

    afterDetails() {
      this.transitionTo('market.new.promotion');
    },

    afterPromotion() {
      this.transitionTo('market.new.preview');
    },

    afterPublish(post) {
      this.transitionTo('market.show', post.get('id')).then(() => {
        this.facebookRecache();
      });
      
      run.next(()=>{
        post.set('listservIds', []);
      });
    },

    backToDetails() {
      this.transitionTo('market.new.details');
    }
  }
});
