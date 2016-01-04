/* global ga */
import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

const { get, isEmpty, merge } = Ember;

export default Ember.Route.extend(ApplicationRouteMixin, {
  intercom: Ember.inject.service('intercom'),
  mixpanel: Ember.inject.service('mixpanel'),

  title: function(tokens) {
    const title = 'dailyUV';
    const tokenString = tokens.reverse().join(' | ');

    return (isEmpty(tokens)) ? title : `${tokenString} | ${title}`;
  },

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

    didTransition() {
      this._super(...arguments);

      const currentUser = get(this, 'session.currentUser');

      if (Ember.isPresent(currentUser)) {
        Ember.run.next(() => {
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
      Ember.run.next(() => {
        const documentTitle = document.title;

        merge(visitProps, userProperties);
        visitProps.targetPageUrl = window.location.href;
        visitProps.sourcePageUrl = from;

        mixpanel.trackEvent('pageVisit', visitProps);

        ga('send', 'pageview', {
          'page': window.location.href,
          'title': documentTitle
        });
      });

      return true; // Bubble the didTransition event
    }
  }
});
