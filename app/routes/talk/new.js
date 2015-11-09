import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import ShareCaching from '../../mixins/routes/share-caching';

export default Ember.Route.extend(Scroll, ShareCaching, {
  mixpanel: Ember.inject.service('mixpanel'),

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

  actions: {
    afterDiscard() {
      this.transitionTo('talk.all');

      const mixpanel = this.get('mixpanel');
      const currentUser = this.get('session.currentUser');
      const props = {};

      Ember.merge(props, mixpanel.getUserProperties(currentUser));
      Ember.merge(props, mixpanel.getNavigationControlProperties('Create Talk', 'Discard Talk'));
      mixpanel.trackEvent('selectNavControl', props);       
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
