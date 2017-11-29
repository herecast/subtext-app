import Ember from 'ember';

const {get, computed, isBlank} = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-OrganizationCard',
  model: null,
  backgroundImageBlock: false,
  onlyShowCityAndState: false,
  showDirections: false,
  hideExpandedFooter: false,

  organization: computed.oneWay('model.organization'),

  backgroundImageUrl: computed('organization.backgroundImageUrl', 'backgroundImageBlock', function() {
    if (get(this, 'backgroundImageBlock')) {
      return '';
    }
    return get(this, 'organiztaion.backgroundImageUrl');
  }),

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
