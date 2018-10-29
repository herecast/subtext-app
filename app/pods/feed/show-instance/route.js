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
  history: service(),

  model(params)  {
    const eventInstanceId = params.event_instance_id || false;

    if (eventInstanceId) {
      return this.store.findRecord('event-instance', eventInstanceId, { reload: true });
    } else {
      this.transitionToRoute('show', params.id);
    }
  },

  loadFeedInParent() {
    //This is to delay load of the feed until after load of integrated detail
    //to speed up first page load speed in fastboot
    const parentModel = this.modelFor('feed');

    if (!get(this, 'fastboot.isFastBoot') && isBlank(parentModel)) {
      this.send('loadFeedFromElsewhere');
    }
  },

  actions: {
    didTransition() {
      this._super();

      const history = get(this, 'history');
      const feedController = this.controllerFor('feed');
      const contentId = this.modelFor(this.routeName).get('contentId');

      if(get(history, 'isFirstRoute')) {
        // Must convert to string for template to be able to compare
        feedController.set('showingDetailInFeed', String(contentId));
      }

      feedController.trackDetailPageViews(contentId);

      this.loadFeedInParent();

      return true;
    },

    willTransition() {
      this._super();
      const feedController = this.controllerFor('feed');

      feedController.set('showingDetailInFeed', null);
      return true;
    }
  }
});
