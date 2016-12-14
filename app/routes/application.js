import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

const { get, set, isPresent, isEmpty, inject, run } = Ember;

export default Ember.Route.extend(ApplicationRouteMixin, {
  intercom: inject.service(),
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
      get(this, 'intercom').shutdown();
      const promise = get(this, 'session').signOut();

      return promise;
    },

    willTransition() {
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

      return true; // Bubble the didTransition event
    },

    scrollTo(offset) {
      Ember.$(window).scrollTop(offset);
    }
  }
});
