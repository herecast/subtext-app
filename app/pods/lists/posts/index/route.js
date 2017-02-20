import Ember from 'ember';
import ResetScroll from 'subtext-ui/mixins/routes/reset-scroll';
import NavigationDisplay from 'subtext-ui/mixins/routes/navigation-display';

export default Ember.Route.extend(ResetScroll, NavigationDisplay, {
  hideHeader: true,
  hideFooter: true,

  model() {
    return this.modelFor('lists.posts');
  }
});
