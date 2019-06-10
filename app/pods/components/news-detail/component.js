import { reads, oneWay, notEmpty } from '@ember/object/computed';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { set, get, computed } from '@ember/object';
import { htmlSafe } from '@ember/template';
import LaunchingContent from 'subtext-app/mixins/components/launching-content';
import ModelResetScroll from 'subtext-app/mixins/components/model-reset-scroll';
import contentComments from 'subtext-app/mixins/content-comments';

export default Component.extend(ModelResetScroll, LaunchingContent, contentComments, {
  'data-test-component': 'news-detail',
  'data-test-content': reads('model.contentId'),
  fastboot: service(),
  tracking: service(),
  session: service(),

  tagName: 'main',
  closeRoute: 'feed',
  closeLabel: 'News',
  isPreview: false,
  model: null,
  enableStickyHeader: false,
  captionHidden: false,
  editPath: 'news.edit',
  editPathId: oneWay('model.id'),

  onClose: null,

  init() {
    this._super(...arguments);
    this._cachedId = get(this, 'model.id');
  },

  trackDetailEngagement: function() {},

  organizations: oneWay('session.currentUser.managedOrganizations'),

  userCanEditNews: computed('session.isAuthenticated', 'organizations.@each.id', 'model.organizationId', function() {
    const managedOrganizations = get(this, 'organizations') || [];
    return isPresent(managedOrganizations.findBy('id', String(get(this, 'model.organizationId'))));
  }),

  hasCaption: notEmpty('model.primaryImageCaption'),

  modelContent: computed('model.content', function() {
    return htmlSafe(get(this, 'model.content'));
  }),

  modelSplitContentHead: computed('model.splitContent.head', function() {
    return htmlSafe(get(this, 'model.splitContent.head'));
  }),

  modelSplitContentTail: computed('model.splitContent.tail', function() {
    return htmlSafe(get(this, 'model.splitContent.tail'));
  }),

  _trackImpression() {
    const model = get(this, 'model');

    // Necessary to check fastboot here, in case
    // didUpdateAttrs calls this from fastboot.
    if(!get(this, 'fastboot.isFastBoot') && !(get(this, 'isPreview'))) {
      get(this, 'tracking').contentImpression(
        model.id
      );
    }
  },

  didUpdateAttrs() {
    this._super(...arguments);

    if (this._cachedId !== get(this, 'model.id')) {
      this._trackImpression();
      this._cachedId = get(this, 'model.id');
    }
  },

  didInsertElement() {
    this._super();
    this._trackImpression();
  },

  actions: {
    toggleCaption(toggle) {
      if(toggle === 'hide') {
        set(this, 'captionHidden', true);
      } else if(toggle === 'unhide') {
        set(this, 'captionHidden', false);
      }
    }
  }

});
