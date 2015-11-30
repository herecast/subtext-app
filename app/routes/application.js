/* global ga */
import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  intercom: Ember.inject.service('intercom'),
  mixpanel: Ember.inject.service('mixpanel'),

  model() {
    return this.get('session.currentUser');
  },

  setupController(controller, model) {
    this._super(controller, model);

    this.get('session').setupCurrentUser();
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
      this.get('intercom').shutdown();
      const promise = this.get('session').signOut();

      callback(promise);
    },

    didTransition: function() {
      const currentUser = this.get('session.currentUser');

      if (Ember.isPresent(currentUser)) {
        Ember.run.next(() => {
          this.get('intercom').update();
        });
      }
      //track all page exits
      const leaveProps = {};
      const visitProps = {};
      const mixpanel = this.get('mixpanel');
      const from = window.location.href;
      const userProperties = mixpanel.getUserProperties(currentUser);

      Ember.merge(leaveProps, userProperties);
      leaveProps.pageUrl = from;
      mixpanel.trackEvent('pageLeave', leaveProps);

      //track all page visits
      Ember.run.next(() => {
        Ember.merge(visitProps, userProperties);
        visitProps.targetPageUrl = window.location.href;
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
