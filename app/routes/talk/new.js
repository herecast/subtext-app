import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';

export default Ember.Route.extend(Scroll, {
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
