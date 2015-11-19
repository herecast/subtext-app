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
      leaveProps['pageUrl'] = from;
      mixpanel.trackEvent('pageLeave', leaveProps);

      //track all page visits
      Ember.run.next(() => {
        Ember.merge(visitProps, userProperties);
        visitProps['targetPageUrl'] = window.location.href;
        visitProps['sourcePageUrl'] = from;
        mixpanel.trackEvent('pageVisit', visitProps);
        ga('send', 'pageview', {
          'page': this.get('url'),
          'title': this.get('url')
        });
      });

      return true; // Bubble the didTransition event
    }
  }

});
