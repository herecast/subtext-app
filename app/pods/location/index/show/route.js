import Ember from 'ember';
import Redirect from 'subtext-ui/mixins/routes/redirect-after-login';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-ui/mixins/routes/title-token-from-content';
import ModalRoute from 'subtext-ui/mixins/routes/modal-route';

const { get, inject:{service} } = Ember;

export default Ember.Route.extend(ModalRoute, Redirect, RouteMetaMixin, DocTitleFromContent, {

  session: service(),
  modals: service(),
  fastboot: service(),

  beforeModel() {
    if (get(this, 'session.startedOnIndexRoute')) {
      get(this, 'modals').resumeService();
    } else {
      get(this, 'modals').pauseService();
      if (!get(this, 'fastboot.isFastBoot')) {
        Ember.$(window).scrollTop(0);
      }
    }
  },

  model(params)  {
    const eventInstanceId = params.eventInstanceId || false;

    if (eventInstanceId) {
      return this.store.findRecord('event-instance', eventInstanceId, { reload: true });
    }

    return this.store.findRecord('feed-content', params.slug, { reload: true });
  }

});
