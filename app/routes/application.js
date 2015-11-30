/* global ga */
import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

const { run, merge, isPresent, get } = Ember;

export default Ember.Route.extend(ApplicationRouteMixin, {
  intercom: Ember.inject.service('intercom'),
  mixpanel: Ember.inject.service('mixpanel'),

  model() {
    return get(this, 'session.currentUser');
  },

  setupController(controller, model) {
    this._super(controller, model);

    get(this, 'session').setupCurrentUser();
  },

  actions: {
    error(errorResponse) {
      const status = errorResponse.errors[0].status;

      if (status === '404') {
        this.transitionTo('error-404');
      } else {
        return true;
      }
    },

    signOut(callback) {
      get(this, 'intercom').shutdown();
      const promise = get(this, 'session').signOut();

      callback(promise);
    },

    didTransition: function() {
      const currentUser = get(this, 'session.currentUser');

      if (isPresent(currentUser)) {
        run.next(() => {
          get(this, 'intercom').update();
        });
      }
      //track all page exits
      const leaveProps = {};
      const visitProps = {};
      const mixpanel = get(this, 'mixpanel');
      const from = window.location.href;
      const userProperties = mixpanel.getUserProperties(currentUser);

      merge(leaveProps, userProperties);
      leaveProps.pageUrl = from;
      mixpanel.trackEvent('pageLeave', leaveProps);

      //track all page visits
      run.next(() => {
        merge(visitProps, userProperties);
        visitProps.targetPageUrl = from;
        visitProps.sourcePageUrl = from;
        mixpanel.trackEvent('pageVisit', visitProps);

        // TODO implement dynamic document tiles and remove this
        const documentTitle = Ember.$('.News-title').text() ||
                              Ember.$('.PhotoBanner-title > div').html() ||
                              Ember.$('.PhotoBanner-title').html() ||
                              Ember.$('.MarketPost-headerContent > h1').html() ||
                              Ember.$('.SectionNavigation-link.active').text(); // use the active nav link as title for index pages...

        ga('send', 'pageview', {
          'page': window.location.href,
          'title': documentTitle
        });
      });

      return true; // Bubble the didTransition event
    }
  }
});
