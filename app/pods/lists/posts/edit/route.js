import Ember from 'ember';
import NavigationDisplay from 'subtext-ui/mixins/routes/navigation-display';
import ResetScroll from 'subtext-ui/mixins/routes/reset-scroll';

const { inject, get, set, isEmpty } = Ember;

export default Ember.Route.extend(ResetScroll, NavigationDisplay, {
  hideHeader: true,
  hideFooter: true,
  api: inject.service(),
  model() {
    const listservContent = this.modelFor('lists.posts');

    if(isEmpty(get(listservContent, 'enhancedPost'))) {
      const channelType = get(listservContent, 'channelType');
      let modelType = channelType || 'talk';

      if(channelType === 'market') {
        modelType = 'market-post';
      }

      const post = this.store.createRecord(
        modelType,
        {
          title: get(listservContent, 'subject'),
          content: get(listservContent, 'body')
        }
      );

      if(channelType !== 'talk') {
        set(post, 'contactEmail',
          get(listservContent, 'senderEmail')
        );
      }

      set(listservContent, 'enhancedPost', post);
    }

    return get(listservContent, 'enhancedPost');
  },

  setupController(controller) {
    this._super(...arguments);

    set(controller, 'listservContent',
      this.modelFor('lists.posts')
    );
  },

  actions: {
    didTransition() {
      get(this, 'api').updateListservProgress(
        get(this.controller, 'listservContent.id'),
        { step_reached: 'edit_post' }
      );

      return this._super(...arguments);
    }
  }
});
