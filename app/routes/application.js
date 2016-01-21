/* global ga */
import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';
import TrackEvent from 'subtext-ui/mixins/track-event';

const { get, isPresent, isEmpty, inject, run } = Ember;

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
      get(this, 'intercom').shutdown();
      const promise = get(this, 'session').signOut();

      callback(promise);
    },

    willTransition() {
      run(() => {
        this.trackEvent('pageLeave');
      });
    },

    didTransition() {
      this._super(...arguments);

      const currentUser = get(this, 'session.currentUser');
      const from = window.location.href;

      if (isPresent(currentUser)) {
        run.next(() => {
          get(this, 'intercom').update();
        });
      }

      //track all page visits
      run.next(() => {
        const documentTitle = document.title;
        let sourcePageUrl = null;

        // If this is triggered by a page refresh, the href and from variables
        // will be the same, so we don't want to track the sourcePageUrl.
        if (window.location.href !== from) {
          sourcePageUrl = from;
        }

        this.trackEvent('pageVisit', {
          sourcePageUrl: sourcePageUrl
        });

        ga('send', 'pageview', {
          'page': window.location.href,
          'title': documentTitle
        });
      });

      return true; // Bubble the didTransition event
    }
  }
});
