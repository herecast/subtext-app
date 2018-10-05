import Ember from 'ember';
import ModelResetScroll from 'subtext-ui/mixins/components/model-reset-scroll';
import contentComments from 'subtext-ui/mixins/content-comments';

const { get, computed, inject, isPresent } = Ember;

export default Ember.Component.extend(ModelResetScroll, contentComments, {
  'data-test-component': 'talk-detail',
  'data-test-content': computed.reads('model.contentId'),
  closeRoute: 'feed',
  fastboot: inject.service(),
  tracking: inject.service(),
  userLocation: inject.service('user-location'),
  closeLabel: 'Talk',
  isPreview: false,
  enableStickyHeader: false,

  trackDetailEngagement: function() {},

  _trackImpression() {
    const id = get(this, 'model.id');

    if(!get(this, 'fastboot.isFastBoot') && !(get(this, 'isPreview'))) {
      get(this, 'tracking').contentImpression(id);
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this._trackImpression();
  },

  didUpdateAttrs(changes) {
    this._super(...arguments);

    const newId = get(changes, 'newAttrs.model.value.id');
    if(isPresent(newId)) {
      const oldId = get(changes, 'oldAttrs.model.value.id');
      if(newId !== oldId) {
        // we have a different model now
        this._trackImpression();
      }
    }
  }
});
