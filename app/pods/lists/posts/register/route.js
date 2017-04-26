import Ember from 'ember';
import ResetScroll from 'subtext-ui/mixins/routes/reset-scroll';
import NavigationDisplay from 'subtext-ui/mixins/routes/navigation-display';

const { get, isEmpty, inject } = Ember;

export default Ember.Route.extend(ResetScroll, NavigationDisplay, {
  api: inject.service(),
  hideHeader: true,
  hideFooter: true,

  model() {
    return this.modelFor('lists.posts.edit');
  },

  redirect(model) {
    if(isEmpty(model)) {
      this.transitionTo('lists.posts');
    }
  },
  actions: {
    didTransition() {
      get(this, 'api').updateListservProgress(
        get(this.controller, 'listservContent.id'),
        { step_reached: 'register' }
      );

      return this._super(...arguments);
    }
  }
});
