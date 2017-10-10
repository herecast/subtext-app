import Ember from 'ember';
import ScrollToTalk from 'subtext-ui/mixins/components/scroll-to-talk';
import ModelResetScroll from 'subtext-ui/mixins/components/model-reset-scroll';
import contentComments from 'subtext-ui/mixins/content-comments';

const {
  computed,
  inject: {service},
  isPresent,
  get,
  set
} = Ember;

export default Ember.Component.extend(ScrollToTalk, ModelResetScroll, contentComments, {
  'data-test-component': 'news-detail',
  'data-test-content': computed.reads('model.contentId'),
  fastboot: service(),
  tracking: service(),
  session: service(),

  tagName: 'main',
  closeRoute: 'feed',
  closeLabel: 'News',
  isPreview: false,
  enableStickyHeader: false,
  captionHidden: false,

  organizations: computed.oneWay('session.currentUser.managedOrganizations'),

  userCanEditNews: computed('session.isAuthenticated', 'organizations.@each.id', 'model.organizationId', function() {
    if (get(this, 'session.isAuthenticated')) {
      return get(this, 'session.currentUser').then(currentUser => {
        return currentUser.isManagerOfOrganizationID(get(this, 'model.organizationId'));
      });
    } else {
      return false;
    }
  }),

  showEditButton: computed('userCanEditNews', 'fastboot.isFastBoot', function() {
    return ! get(this, 'fastboot.isFastBoot') && get(this, 'userCanEditNews');
  }),

  hasCaptionOrCredit: computed('model.bannerImage.{caption,credit}', function() {
    return Ember.isPresent(this.get('model.bannerImage.caption')) ||
      Ember.isPresent(this.get('model.bannerImage.credit'));
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
