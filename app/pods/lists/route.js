import Ember from 'ember';
import NavigationDisplay from 'subtext-ui/mixins/routes/navigation-display';
import NoHttpCache from 'subtext-ui/mixins/routes/no-http-cache';

export default Ember.Route.extend(NavigationDisplay, NoHttpCache, {
  hideHeader: true,
  hideFooter: true
});
