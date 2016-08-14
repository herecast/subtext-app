import Ember from 'ember';
import ScrollToTalk from 'subtext-ui/mixins/components/scroll-to-talk';

const { computed, get } = Ember;

export default Ember.Component.extend(ScrollToTalk, {
  closeRoute: 'news.all',
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
  })
});
