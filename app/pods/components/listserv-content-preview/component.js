import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const { get, computed, inject } = Ember;

export default Ember.Component.extend(TestSelector, {
  model: Ember.computed.alias('enhancedPost'),
  isPreview: true,
  isMinimalist: false,

  api: inject.service(),

  previewComponentName: computed('listservContent', function() {
    const lc = get(this, 'listservContent');
    if(get(lc, 'isMarket')) {
      return 'market-detail';
    } else if(get(lc, 'isEvent')) {
      return 'event-detail';
    } else {
      return 'talk-detail';
    }
  }),

  summaryComponentName: computed('listservContent', function() {
    const lc = get(this, 'listservContent');
    if(get(lc, 'isMarket')) {
      return 'market-preview-summary';
    } else if(get(lc, 'isEvent')) {
      return 'event-preview-summary';
    } else {
      return 'talk-preview-summary';
    }
  }),

  didInsertElement() {
    this._super(...arguments);
    const api = get(this, 'api');

    api.updateListservProgress(get(this, 'listservContent.id'), {
      'step_reached': 'preview_post'
    });
  },

  actions: {
    afterPublish() {
      get(this, 'afterPublish')();
    }
  }
});
