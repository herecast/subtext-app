import Ember from 'ember';
import ScrollToTalk from 'subtext-ui/mixins/components/scroll-to-talk';
import ModelResetScroll from 'subtext-ui/mixins/components/model-reset-scroll';

const {
  computed,
  inject,
  isPresent,
  get
} = Ember;

export default Ember.Component.extend(ScrollToTalk, ModelResetScroll, {
  fastboot: inject.service(),
  tracking: inject.service(),
  tagName: 'main',
  closeRoute: 'news.index',
  closeLabel: 'News',
  isPreview: false,

  organizations: computed.oneWay('session.currentUser.managedOrganizations'),

  canEdit: computed('organizations.@each.id', 'model.organization.id', function() {
    const userOrganizations = get(this, 'organizations') || [];
    const newsOrganizationId = get(this, 'model.organization.id');
    const orgIds = userOrganizations.map((item) => { return get(item, 'id'); });

    return orgIds.indexOf(newsOrganizationId) !== -1;
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

});
