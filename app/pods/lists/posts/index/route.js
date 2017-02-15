import Ember from 'ember';
import NavigationDisplay from 'subtext-ui/mixins/routes/navigation-display';

export default Ember.Route.extend(NavigationDisplay, {
  hideHeader: true,
  hideFooter: true,

  model() {
    return this.modelFor('lists.posts');
  }
});
