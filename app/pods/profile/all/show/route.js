import Ember from 'ember';
import Redirect from 'subtext-ui/mixins/routes/redirect-after-login';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-ui/mixins/routes/title-token-from-content';
import FastbootTransitionRouteProtocol from 'subtext-ui/mixins/routes/fastboot-transition-route-protocol';

const {
  get,
  isBlank,
  inject:{service}
} = Ember;

export default Ember.Route.extend(FastbootTransitionRouteProtocol, Redirect, RouteMetaMixin, DocTitleFromContent, {
  fastboot: service(),

  model(params)  {
    return this.store.findRecord('content', params.contentId, {reload: true});
  },

  afterModel(model) {
    const eventInstanceId = get(model, 'eventInstanceId') || false;

    if (eventInstanceId) {
      return this.transitionTo(`${this.routeName}-instance`, get(model, 'contentId'), eventInstanceId);
    } else {
      return this._super(...arguments);
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
