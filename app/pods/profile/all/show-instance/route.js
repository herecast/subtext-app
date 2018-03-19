import Ember from 'ember';
import Redirect from 'subtext-ui/mixins/routes/redirect-after-login';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-ui/mixins/routes/title-token-from-content';

const { get, isBlank, inject:{service} } = Ember;

export default Ember.Route.extend(Redirect, RouteMetaMixin, DocTitleFromContent, {
  fastboot: service(),

  model(params)  {
    const eventInstanceId = params.eventInstanceId || false;

    if (eventInstanceId) {
      return this.store.findRecord('event-instance', eventInstanceId, {reload: true});
    } else {
      this.transitionToRoute('show', params.contentId);
    }
  },

  loadProfileFeedInParent() {
    //This is to delay load of the feed until after load of integrated detail
    //to speed up first page load speed
    const parentModel = this.modelFor('profile.all');

    if (!get(this, 'fastboot.isFastBoot') && isBlank(parentModel)) {
      this.send('loadProfileFeedFromChild');
    }
  },

  actions: {
    didTransition() {
      this.loadProfileFeedInParent();
    }
  }
});
