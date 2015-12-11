import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from 'simple-auth/mixins/authenticated-route-mixin';
import ShareCaching from '../../mixins/routes/share-caching';

export default Ember.Route.extend(Scroll, Authorized, ShareCaching, {
  intercom: Ember.inject.service('intercom'),
  mixpanel: Ember.inject.service('mixpanel'),

  model() {
    return this.store.createRecord('event', {
      listservIds: []
    });
  },

  redirect() {
    this.transitionTo('events.new.details');
  },

  actions: {
    afterDiscard() {
      this.transitionTo('events.all');

      const mixpanel = this.get('mixpanel');
      const currentUser = this.get('session.currentUser');
      const props = {};

      Ember.merge(props, mixpanel.getUserProperties(currentUser));
      Ember.merge(props, mixpanel.getNavigationControlProperties('Create Event', 'Discard Event'));
      mixpanel.trackEvent('selectNavControl', props);       
    },

    afterDetails() {
      this.transitionTo('events.new.promotion');
    },

    afterPromotion() {
      this.transitionTo('events.new.preview');
    },

    afterPublish(event) {
      const firstInstanceId = event.get('firstInstanceId');

      this.get('intercom').trackEvent('published-event');

      this.transitionTo('events.show', firstInstanceId).then(this.facebookRecache);
    },

    backToDetails() {
      this.transitionTo('events.new.details');
    }
  }
});
