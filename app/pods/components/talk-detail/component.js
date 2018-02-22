import Ember from 'ember';
import ScrollToTalk from 'subtext-ui/mixins/components/scroll-to-talk';
import ModelResetScroll from 'subtext-ui/mixins/components/model-reset-scroll';
import contentComments from 'subtext-ui/mixins/content-comments';

const { get, computed, inject, isPresent } = Ember;

export default Ember.Component.extend(ScrollToTalk, ModelResetScroll, contentComments, {
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

  listservLocationLabel: computed('userLocation.location.city', 'userLocation.location.state', function() {
    return `${get(this, 'userLocation.location.city')} ${get(this, 'userLocation.location.state')}`;
   }),

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
