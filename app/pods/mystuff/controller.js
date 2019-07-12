import { alias, readOnly } from '@ember/object/computed';
import { computed, set, get } from '@ember/object';
import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import MystuffNavObjects from 'subtext-app/mixins/mystuff-nav-objects';

export default Controller.extend(MystuffNavObjects, {
  fastboot: service(),
  session: service(),

  mystuffRouteObjects: alias('mystuffNavObjects'),

  currentUserId: readOnly('session.userId'),

  currentUser: computed('session.currentUser', function() {
    return get(this, 'session.currentUser');
  }),

  applicationController: controller('application'),

  activeRouteName: readOnly('applicationController.currentRouteName'),
  activeRoute: computed('activeRouteName', function() {
    const routeObjects = get(this, 'mystuffRouteObjects');
    const activeRouteName = get(this, 'activeRouteName');

    return routeObjects.find(routeObject => this._routesMatch(activeRouteName, routeObject.routeName));
  }),

  outletAnimationDirection: 'toLeft',
  outletClass: computed('outletAnimationDirection', function() {
    return `Mystuff-${get(this, 'outletAnimationDirection')}`;
  }),

  _routesMatch(baseRouteName, comparisonRouteName) {
    const baseRouteArray = baseRouteName.split('.');
    const comparisonRouteArray = comparisonRouteName.split('.');

    return  baseRouteArray[0] === comparisonRouteArray[0] &&
            baseRouteArray[1] === comparisonRouteArray[1];
  },

  actions: {
    onChangeRoute(toRoute) {
      const activeRouteName = get(this, 'activeRouteName');

      const fromRoute = get(this, 'mystuffRouteObjects').find(route => this._routesMatch(activeRouteName, route.routeName));

      const changeDirection = ( parseInt(toRoute.order) - parseInt(fromRoute.order) ) < 0 ? 'toRight' : 'toLeft';

      set(this, 'outletAnimationDirection', changeDirection);

      run.later(() => {
        this.transitionToRoute(toRoute.routeName);
      });
    }
  }

});
