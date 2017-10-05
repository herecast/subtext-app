import Ember from 'ember';
import moment from 'moment';
import ScrollToTalk from 'subtext-ui/mixins/components/scroll-to-talk';
import ModelResetScroll from 'subtext-ui/mixins/components/model-reset-scroll';

const { get, computed, inject, isPresent } = Ember;

export default Ember.Component.extend(ScrollToTalk, ModelResetScroll, {
  'data-test-component': 'talk-detail',
  'data-test-content': computed.reads('model.contentId'),
  closeRoute: 'feed',
  fastboot: inject.service(),
  tracking: inject.service(),
  closeLabel: 'Talk',
  isPreview: false,
  enableStickyHeader: false,

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
  },

  formattedPublishedAt: computed('model.publishedAt', function() {
    return moment(get(this, 'model.publishedAt')).format('dddd, MMMM Do, YYYY');
  })
});
