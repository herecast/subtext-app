/* global ga */
import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';
import TrackEvent from 'subtext-ui/mixins/track-event';
import HistoryMix from 'subtext-ui/mixins/routes/history';


const { get, isPresent, isEmpty, inject, run } = Ember;

export default Ember.Route.extend(ApplicationRouteMixin, TrackEvent, HistoryMix, {
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
    trackPageView(sourcePageUrl) {
      const documentTitle = document.title;

      this.trackEvent('pageVisit', {
        sourcePageUrl: sourcePageUrl
      });

      ga('send', 'pageview', {
        'page': window.location.href,
        'title': documentTitle
      });
    },
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
        this.trackEvent('signOut', {
          navControlGroup: 'User Account Menu',
          navControl: 'Sign Out'
        });
      });

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
      /*
       * The history service is manually updated here
       * so it correctly tracks the referring page.
       */
      this.get('history').update();

      const currentUser = get(this, 'session.currentUser');

      if (isPresent(currentUser)) {
        run.next(() => {
          get(this, 'intercom').update();
        });
      }

      //track all page visits
      run.next(() => {
        // We only care about the url/path, not the query params at this point.
        const fromUrlPath = this.get('history.referrer').split('?')[0];
        const toUrlPath = window.location.href.split('?')[0];
        const from = this.get('history.referrer');

        if(fromUrlPath !== toUrlPath) {
          let sourcePageUrl = null;
          // If this is triggered by a page refresh, the href and from variables
          // will be the same, so we don't want to track the sourcePageUrl.
          if (window.location.href !== from) {
            sourcePageUrl = from;
          }

          this.send('trackPageView',sourcePageUrl);
        }
      });

      return true; // Bubble the didTransition event
    }
  }
});
