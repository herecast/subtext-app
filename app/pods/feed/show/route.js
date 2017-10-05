import Ember from 'ember';
import Redirect from 'subtext-ui/mixins/routes/redirect-after-login';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-ui/mixins/routes/title-token-from-content';

const {
  get,
  isPresent,
  inject: {service}
} = Ember;

export default Ember.Route.extend(Redirect, RouteMetaMixin, DocTitleFromContent, {
  session: service(),
  modals: service(),
  fastboot: service(),
  history: service(),

  model(params)  {
    return this.store.findRecord('feed-content', params.id, { reload: true });
  },

  afterModel(model) {
    if (isPresent(get(model, 'eventInstanceId'))) {
      this.transitionTo('feed.show-instance', get(model, 'id'), get(model, 'eventInstanceId'));
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
