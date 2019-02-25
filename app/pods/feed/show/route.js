import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { isBlank } from '@ember/utils';
import { inject as service } from '@ember/service';
import Redirect from 'subtext-ui/mixins/routes/redirect-after-login';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-ui/mixins/routes/title-token-from-content';
import FastbootTransitionRouteProtocol from 'subtext-ui/mixins/routes/fastboot-transition-route-protocol';

export default Route.extend(FastbootTransitionRouteProtocol, Redirect, RouteMetaMixin, DocTitleFromContent, {
  session: service(),
  modals: service(),
  fastboot: service(),

  model(params)  {
    return this.store.findRecord('content', params.id, { reload: true });
  },

  afterModel(model) {
    const eventInstanceId = get(model, 'eventInstanceId') || false;

    if (eventInstanceId) {
      this.transitionTo('feed.show-instance', get(model, 'id'), eventInstanceId);
    } else {
      this._super(...arguments);
    }
  },

  loadFeedInParent() {
    //This is to delay load of the feed until after load of integrated detail
    //to speed up first page load speed
    const parentModel = this.modelFor('feed');

    if (!get(this, 'fastboot.isFastBoot') && isBlank(parentModel)) {
      const contentLocationId = this.modelFor(this.routeName).get('locationId');

      this.send('loadFeedFromElsewhere', contentLocationId);
    }

  },

  actions: {
    didTransition() {
      this._super(...arguments);

      const feedController = this.controllerFor('feed');
      const contentId = this.modelFor(this.routeName).get('contentId');

      feedController.trackDetailPageViews(contentId);

      this.loadFeedInParent();

      return true;
    }
  }
});
