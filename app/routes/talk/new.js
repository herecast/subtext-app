import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from '../../mixins/routes/authorized';

export default Ember.Route.extend(Scroll, Authorized, {
  mixpanel: Ember.inject.service('mixpanel'),
  session: Ember.inject.service('session'),

  model() {
    return this.store.createRecord('talk', {
      pageviewsCount: 0,
      userCount: 1,
      authorName: this.get('session.currentUser.name')
    });
  },

  redirect() {
    this.transitionTo('talk.new.details');
  },

  actions: {
    afterDiscard() {
      this.transitionTo('talk.all');
    },

    afterDetails() {
      this.transitionTo('talk.new.promotion');
    },

    afterPromotion() {
      this.transitionTo('talk.new.preview');
    },

    afterPublish(talk) {
      this.get('mixpanel').trackEvent('Talk Publish');

      this.transitionTo('talk.show', talk.get('id'));
    },

    backToDetails() {
      this.transitionTo('talk.new.details');
    }
  }
});
