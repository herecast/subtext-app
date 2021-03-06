import { inject as service } from '@ember/service';
import $ from 'jquery';
import Route from '@ember/routing/route';
import { set, get } from '@ember/object';
import { isEmpty, isPresent } from '@ember/utils';
import { run } from '@ember/runloop';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {
  tracking: service(),
  intercom: service(),
  history: service(),
  windowLocation: service(),
  search: service(),
  modals: service(),
  fastboot: service(),
  userActivity: service(),
  cookies: service(),
  logger: service(),
  store: service(),
  router: service(),
  session: service(),

  title: function(tokens) {
    const title = 'HereCast';
    const tokenString = tokens.reverse().join(' | ');

    return (isEmpty(tokens)) ? title : `${tokenString} | ${title}`;
  },

  queryParams: {
    q: {refreshModel: true}
  },

  model() {
    return this.get('session.currentUser');
  },

  sessionAuthenticated() {
    const _super = this._super;

    get(this, 'session.currentUser')
    .then(() => {
      _super.call(this, ...arguments);
    });
  },

  sessionInvalidated () {
    //session destroy override: so app is not reloaded to root
    if (get(this, 'session.skipRedirect')) {
      set(this, 'session.skipRedirect', false);
      get(this, 'windowLocation').reload();
    } else if (get(this, 'session.noReload')) {
      set(this, 'session.noReload', false);
      get(this, 'store').unloadAll('currentUser');
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
        if (isPresent(error.status) && (400 <= parseInt(error.status) < 500)) {
          logError = false;
        }

        if (logError) {
          get(this, 'logger').error(error);
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

      if (!get(this, 'fastboot.isFastBoot')) {
        this.get('history').update();

        const currentUser = get(this, 'session.currentUser');

        if (isPresent(currentUser)) {
          run.next(() => {
            get(this, 'intercom').update(currentUser);
          });
        }
      }

      return true; // Bubble the didTransition event
    },

    scrollTo(offset) {
      if (!get(this, 'fastboot.isFastBoot')) {
        $(window).scrollTop(offset);
      }
    }
  }
});
