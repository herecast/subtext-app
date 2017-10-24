import Ember from 'ember';

const {get, computed, isBlank} = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-OrganizationCard',
  model: null,
  organization: computed.oneWay('model.organization'),

  willExpandDescription: false,
  isDescriptionExpanded: false,

  isHeaderCard: false,

  hasNoImage: computed('organization.{backgroundImageUrl,displayImageUrl}', function() {
    return isBlank(get(this, 'organization.backgroundImageUrl')) && isBlank(get(this, 'organization.displayImageUrl'));
  }),

  actions: {
    toggleDescription() {
      this.toggleProperty('isDescriptionExpanded');
    }
  }
});
