/* global ga */
import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';
import TrackEvent from 'subtext-ui/mixins/track-event';

const { get, isPresent, isEmpty, merge, inject, run } = Ember;

export default Ember.Route.extend(ApplicationRouteMixin, TrackEvent, {
  intercom: inject.service(),
  mixpanel: inject.service(),

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
      // Force the tracker to run now so it's run before the user logs out
      // while the tracking properties are available.
      run(() => {
        this.trackEvent('selectNavControl', {
          navControlGroup: 'User Account Menu',
          navControl: 'log out'
        });
      });

      get(this, 'intercom').shutdown();
      const promise = get(this, 'session').signOut();

      callback(promise);
    },

    didTransition() {
      this._super(...arguments);

      // TODO refactor all of the analytics code out of here
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
