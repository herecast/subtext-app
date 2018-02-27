import Ember from 'ember';

const { get, set, computed, inject:{controller, service}, run } = Ember;

const mystuffRouteObjects = [
  {
    order: 0,
    routeName: 'mystuff.contents.index',
    title: 'Contents',
    iconActive: 'window-maximize',
    iconInactive: 'window-maximize'
  },
  {
    order: 1,
    routeName: 'mystuff.comments.index',
    title: 'Comments',
    iconActive: 'comments',
    iconInactive: 'comments-o'
  },
  {
    order: 2,
    routeName: 'mystuff.subscriptions',
    title: 'Subscriptions',
    iconActive: 'newspaper-o',
    iconInactive: 'newspaper-o'
  },
  {
    order: 3,
    routeName: 'mystuff.account',
    title: 'Account',
    iconActive: 'user',
    iconInactive: 'user-o'
  }
];

export default Ember.Controller.extend({
  mystuffRouteObjects: mystuffRouteObjects,

  session: service(),

  currentUserId: computed.readOnly('session.userId'),

  currentUser: computed('session.currentUser', function() {
    return get(this, 'session.currentUser');
  }),

  applicationController: controller('application'),

  activeRouteName: computed.readOnly('applicationController.currentRouteName'),
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

      const fromRoute = mystuffRouteObjects.find(route => this._routesMatch(activeRouteName, route.routeName));

      const changeDirection = ( parseInt(toRoute.order) - parseInt(fromRoute.order) ) < 0 ? 'toRight' : 'toLeft';

      set(this, 'outletAnimationDirection', changeDirection);

      run.later(() => {
        this.transitionToRoute(toRoute.routeName);
      });
    }
  }

});
