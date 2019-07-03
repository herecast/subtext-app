import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({
  classNames: 'Mystuff-NavBar',
  classNameBindings: ['verticalLayout:vertical:horizontal', 'whiteButtons:white-buttons'],
  'data-test-mystuff-navbar': true,

  activeRoute: null,
  verticalLayout: false,
  routes: null,
  whiteButtons: false,

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
