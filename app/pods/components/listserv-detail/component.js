import Ember from 'ember';
import ModelResetScroll from 'subtext-ui/mixins/components/model-reset-scroll';
import contentComments from 'subtext-ui/mixins/content-comments';

const {
  get,
  computed,
  isPresent,
  inject
} = Ember;

export default Ember.Component.extend(ModelResetScroll, contentComments, {
  'data-test-component': 'listserv-detail',
  'data-test-content': computed.reads('model.contentId'),

  fastboot: inject.service(),
  tracking: inject.service(),
  userLocation: inject.service('user-location'),
  enableStickyHeader: false,

  trackDetailEngagement: function(){},

  _trackImpression() {
    const id = get(this, 'model.contentId');

    if (!get(this, 'fastboot.isFastBoot')) {
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
        this._trackImpression();
      }
    }
  },

  listservLocationLabel: computed.alias('userLocation.location.name'),

  actions: {
    clickReplyButton() {
      get(this, 'tracking').push({
        'event': 'listserv-reply-click'
      });
    }
  }
});
