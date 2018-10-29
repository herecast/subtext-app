import Route from '@ember/routing/route';
import NavigationDisplay from 'subtext-ui/mixins/routes/navigation-display';
import NoHttpCache from 'subtext-ui/mixins/routes/no-http-cache';

export default Route.extend(NavigationDisplay, NoHttpCache, {
  hideHeader: true,
  hideFooter: true
});
