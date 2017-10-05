import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

const { get, set, isPresent, isEmpty, inject, run } = Ember;

export default Ember.Route.extend(ApplicationRouteMixin, {
  tracking: inject.service(),
  intercom: inject.service(),
  history: inject.service(),
  windowLocation: inject.service(),
  search: inject.service(),
  modals: inject.service(),
  fastboot: inject.service(),
  userActivity: inject.service(),
  cookies: inject.service(),

  title: function(tokens) {
    const title = 'dailyUV';
    const tokenString = tokens.reverse().join(' | ');

    return (isEmpty(tokens)) ? title : `${tokenString} | ${title}`;
  },
  
  queryParams: {
    q: {refreshModel: true}
  },

  beforeModel(transition) {
    if (transition.sequence === 0 && !Ember.testing && !get(this, 'fastboot.isFastBoot')) {
      const userActivity = get(this, 'userActivity');
      const timeIntervals = [0, 11000, 31000, 61000, 181000, 601000, 1801000];

      userActivity.register('sessionTimer', window);
      userActivity.triggerTimedEvents('sessionTimer', (time) => {
        get(this, 'tracking').push({
          'event'             : 'VirtualSessionTimerEvent',
          'virtualTimeOnPage' : time,
          'virtualPageUrl'    : window.location.href
        });
      }, timeIntervals);
    }
  },

  model() {
    return this.get('session.currentUser');
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
    error(error, transition) {
      const isFastboot = get(this, 'fastboot.isFastBoot');

      /**
       * if we receive a 401 from the api during a route transition
       * react like simple auth would for authenticated routes.
       */
      if (isPresent(error.status) && error.status === 401) {
        if (isFastboot) {
          const fastboot = get(this, 'fastboot');
          const cookies = get(this, 'cookies');

          cookies.write('ember_simple_auth-redirectTarget', transition.intent.url, {
            path: '/',
            secure: fastboot.get('request.protocol') === 'https'
          });
        } else {
          set(this, 'session.attemptedTransition', transition);
        }

        this.transitionTo('login');
      } else {
        let statusCode;

        if (isFastboot) {
          try {
            statusCode = error.status || (isPresent(error.response) ? error.response.status : error.errors[0].status);
          } catch (err) {
            statusCode = 500;
          }
          set(this, 'fastboot.response.statusCode', statusCode);
        }

        let logError = true;

        // If we get a status code other than client caused (400-499),
        // then we want to log it.
        if(isPresent(error.status) && (400 <= parseInt(error.status) < 500)) {
          logError = false;
        }

        if(logError) {
          console.error('[ApplicationRoute:]', error);
        }

        this.intermediateTransitionTo('error-404');
      }
    },

    signOut() {
      get(this, 'intercom').shutdown();
      const promise = get(this, 'session').signOut();

      return promise;
    },

    didTransition() {
      this._super(...arguments);
      get(this, 'modals').clearModals();
      /*
       * The history service is manually updated here
       * so it correctly tracks the referring page.
       */

      this.get('history').update();

      const currentUser = get(this, 'session.currentUser');

      if (isPresent(currentUser)) {
        run.next(() => {
          get(this, 'intercom').update(currentUser);
        });
      }

      return true; // Bubble the didTransition event
    },

    scrollTo(offset) {
      if (!get(this, 'fastboot.isFastBoot')) {
        Ember.$(window).scrollTop(offset);
      }
    }
  }
});
