import Ember from 'ember';

const { get, computed } = Ember;

export default Ember.Component.extend({
  classNames: 'Mystuff-NavBar',
  classNameBindings: ['verticalLayout:vertical:horizontal'],
  'data-test-mystuff-navbar': true,

  routes: [],
  activeRoute: null,

  verticalLayout: false,

  breadcrumbMessage: computed('activeRoute', function() {
    const activeRoute = get(this, 'activeRoute');

    let message = null;

    if (activeRoute) {
      message = `Viewing Your ${activeRoute.title}`;
    }

    return message;
  }),

  actions: {
    changeActiveRoute(route) {
      if (get(this, 'activeRoute.routeName') !== route.routeName && get(this, 'onChangeRoute')) {
        get(this, 'onChangeRoute')(route);
      }
    }
  }
});
