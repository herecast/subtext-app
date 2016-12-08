import Ember from 'ember';

const { get, computed } = Ember;

export default Ember.Component.extend({
  model: Ember.computed.alias('enhancedPost'),
  isPreview: true,
  isMinimalist: false,

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

  actions: {
    afterPublish() {
      get(this, 'afterPublish')();
    }
  }
});
