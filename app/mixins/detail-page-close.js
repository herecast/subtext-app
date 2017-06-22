import Ember from 'ember';
import config from 'subtext-ui/config/environment';

const {
  inject,
  get,
  Mixin,
  computed
} = Ember;

export default Mixin.create({
  defaultCloseRoute: null,
  defaultCloseParams: [],
  history: inject.service(),
  previousRoute: computed.alias('history.previousRouteName'),
  previousParams: computed.alias('history.previousRouteParams'),
  overrideRoutes: config.contentIndexRoutes,

  closeRoute: computed('overrideRoutes.[]', 'defaultCloseRoute', 'previousRoute', function() {
      const overrides = get(this, 'overrideRoutes');
      const closeRoute = get(this, 'defaultCloseRoute');
      const previousRoute = get(this, 'previousRoute');

      if(overrides.includes(previousRoute)) {
        return previousRoute;
      } else {
        return closeRoute;
      }
  }),

  closeParams: computed('overrideParams', 'previousRoute', 'previousParams', 'defaultCloseParams', function() {
    const overrides = get(this, 'overrideRoutes');
    const previousRoute = get(this, 'previousRoute');

    if(overrides.includes(previousRoute)) {
      return get(this, 'previousParams');
    } else {
      return get(this, 'defaultCloseParams');
    }
  })
});

