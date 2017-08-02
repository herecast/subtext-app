import Ember from 'ember';

const {get, set, run, inject, computed} = Ember;


export default Ember.Service.extend({
  windowService: inject.service('window-location'),
  fastboot: inject.service(),
  routeName: null,
  routeModel: null,
  referrer: "",
  current: null,
  historyLimit: 15,
  routeHistory: Ember.A(),

  setRouteName(name) {
    set(this, 'routeName', name);
  },
  setRouteModel(model) {
    set(this, 'routeModel', model);
  },

  trackRouteChange(routeName, state) {
    const routeHistory = get(this, 'routeHistory');

    if (routeName !== 'loading') {
      routeHistory.arrayContentWillChange(0, 0, 1);
      routeHistory.pushObject({
        routeName: routeName,
        params: state.routerJsState.params,
        queryParams: state.routerJsState.queryParams
      });
      routeHistory.arrayContentDidChange(0, 0, 1);
    }

    const limit = get(this, '_historyLimit');
    if (routeHistory.get('length') > limit) {
      routeHistory.arrayContentWillChange(0, 1, 0);
      routeHistory.shiftObject();
      routeHistory.arrayContentDidChange(0, 1, 0);
    }
  },

  currentRouteName: computed('currentRoute.routeName', function() {
    return get(this, 'currentRoute.routeName');
  }),

  currentRoute: computed('routeHistory.[]', function() {
    return get(this, 'routeHistory.lastObject');
  }),

  previousRouteName: computed('routeHistory.[]', function() {
    const routeHistory = get(this, 'routeHistory');
    const previousRoute = routeHistory.objectAt(routeHistory.length - 2);

    if (previousRoute) {
      return get(previousRoute, 'routeName');
    } else {
      return null;
    }
  }),

  previousRouteParams: computed('routeHistory.[]', function() {
    const routeHistory = get(this, 'routeHistory');
    const previousRoute = routeHistory.objectAt(routeHistory.length - 2);

    if (previousRoute) {
      return this.extractOrderedParams(get(previousRoute, 'params') || {});
    } else {
      return null;
    }
  }),

  update() {
    const windowService = get(this, 'windowService');
    if (get(this, 'current')) {
      set(this, 'referrer', get(this, 'current'));
    } else {
      set(this, 'referrer', windowService.referrer());
    }
    run.next(() => {
      const href = windowService.href();
      set(this, 'current', href);
    });
  },

  /**
   * Returns an array which can be used in transitionToRoute.
   *
   * @param params - original data structure looks like this:
   * {
   *   application: {},
   *   routeName: {id: 1},
   *   routeName.index: {}
   * }
   *
   * @returns {Array}
   */
  extractOrderedParams(params) {
    const returnParams = [];

    for (let routeName in params) {
      if (Object.keys(params[routeName]).length) {
        for (let paramName in params[routeName]) {
          returnParams.push(params[routeName][paramName]);
        }
      }
    }

    return returnParams;
  }
});
