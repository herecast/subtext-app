import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const { get, set, computed } = Ember;

export default Ember.Component.extend(TestSelector, {
  model: Ember.computed.alias('enhancedPost'),
  isPreview: true,
  isMinimalist: false,

  _getTrackingArguments() {
    const listservContent = get(this, 'listservContent');
    let navControl;

    if(get(listservContent, 'isEvent')) {
      navControl = 'Submit Event';
    } else if(get(listservContent, 'isMarket')) {
      navControl = 'Submit Market Listing';
    } else if(get(listservContent, 'isTalk')) {
      navControl = 'Submit Talk';
    }

    return {
      navControlGroup: 'Submit Content',
      navControl: navControl
    };
  },

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
