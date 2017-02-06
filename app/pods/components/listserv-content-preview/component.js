import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const { get, set, computed, inject } = Ember;

export default Ember.Component.extend(TestSelector, {
  model: Ember.computed.alias('enhancedPost'),
  api: inject.service(),
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


  didInsertElement() {
    this._super(...arguments);
    const api = get(this, 'api');

    api.updateListservProgress(get(this, 'listservContent.id'), {
      'step_reached': 'preview_post'
    });
  },

  actions: {
    save(callback) {
      this.set('isSaving', true);
      const promise = get(this, 'model').save();

      callback(promise);

      promise.then((saved) => {
        this.attrs.afterPublish(saved);
      }).finally(()=>{
        set(this, 'isSaving', false);
      });
    },
    trackMapClick() { /*noop*/  },
    trackEventInfoClick() { /*noop*/  }
  }
});
