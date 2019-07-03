import Route from '@ember/routing/route';
import NavigationDisplay from 'subtext-app/mixins/routes/navigation-display';
import NoHttpCache from 'subtext-app/mixins/routes/no-http-cache';

export default Route.extend(NavigationDisplay, NoHttpCache, {
  hideHeader: true,
  hideFooter: true,

  renderTemplate() {
    this.render('welcome', {
      outlet: 'welcome'
    });
  }
});
