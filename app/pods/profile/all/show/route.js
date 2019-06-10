import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { isBlank } from '@ember/utils';
import { inject as service } from '@ember/service';
import Redirect from 'subtext-app/mixins/routes/redirect-after-login';
import RouteMetaMixin from 'subtext-app/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-app/mixins/routes/title-token-from-content';
import FastbootTransitionRouteProtocol from 'subtext-app/mixins/routes/fastboot-transition-route-protocol';

export default Route.extend(FastbootTransitionRouteProtocol, Redirect, RouteMetaMixin, DocTitleFromContent, {
  fastboot: service(),

  model(params)  {
    return this.store.findRecord('content', params.content_id, {reload: true});
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
