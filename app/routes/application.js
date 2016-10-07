import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import TrackEvent from 'subtext-ui/mixins/track-event';

const { get, set, isPresent, isEmpty, inject, run } = Ember;

export default Ember.Route.extend(ApplicationRouteMixin, TrackEvent, {
  intercom: inject.service(),
  mixpanel: inject.service(),
  history: inject.service(),
  windowLocation: inject.service(),
  search: inject.service(),
  modals: inject.service(),

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

  sessionAuthenticated() {
    // Don't do anything.
  },

  sessionInvalidated () {
    //session destroy override: so app is not reloaded to root
    if (get(this, 'session.skipRedirect')) {
      set(this, 'session.skipRedirect', false);
      get(this,'windowLocation').reload();
    } else {
      this._super(...arguments);
    }
  },

  actions: {
    trackPageView(sourcePageUrl) {
      this.trackEvent('pageVisit', {
        sourcePageUrl: sourcePageUrl
      });
    },

    error(errorResponse) {
      if (errorResponse.errors) {
        const status = errorResponse.errors[0].status;

        if (status === '404') {
          this.transitionTo('error-404');
        } else {
          return true;
        }
      } else {
        return true;
      }
    },

    signOut() {
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

      return promise;
    },

    willTransition() {
      run(() => {
        this.trackEvent('pageLeave');
      });
      get(this, 'modals').clearModals();
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
        const toUrlPath = get(this,'windowLocation').href().split('?')[0];
        const from = this.get('history.referrer');

        if(fromUrlPath !== toUrlPath) {
          let sourcePageUrl = null;
          // If this is triggered by a page refresh, the href and from variables
          // will be the same, so we don't want to track the sourcePageUrl.
          if (get(this,'windowLocation').href() !== from) {
            sourcePageUrl = from;
          }

          this.send('trackPageView',sourcePageUrl);
        }
      });

      return true; // Bubble the didTransition event
    },

    scrollTo(offset) {
      Ember.$(window).scrollTop(offset);
    }
  }
});
