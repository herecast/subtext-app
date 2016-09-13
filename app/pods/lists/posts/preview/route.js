import Ember from 'ember';
import ResetScroll from 'subtext-ui/mixins/routes/reset-scroll';
import NavigationDisplay from 'subtext-ui/mixins/routes/navigation-display';

const { isEmpty } = Ember;

export default Ember.Route.extend(NavigationDisplay, ResetScroll, {
  hideHeader: true,
  hideFooter: true,

  model() {
    return this.modelFor('lists.posts');
  },

  afterModel(model) {
    if(isEmpty(model.enhancedPost)) {
      this.transitionTo(
        'lists.posts',
        model
      );
    }
  }
});
