import { oneWay, not } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { isBlank } from '@ember/utils';
import { htmlSafe } from '@ember/template';

export default Component.extend({
  classNames: 'FeedCard-OrganizationCard',
  model: null,
  backgroundImageBlock: false,
  onlyShowCityAndState: false,
  showDirections: false,
  hideExpandedFooter: false,
  showExpandedFooter: not('hideExpandedFooter'),

  organization: oneWay('model.organization'),

  backgroundImageUrl: computed('organization.backgroundImageUrl', 'backgroundImageBlock', function() {
    if (get(this, 'backgroundImageBlock')) {
      return '';
    }
    return get(this, 'organization.backgroundImageUrl');
  }),

  willExpandDescription: false,
  isDescriptionExpanded: false,

  isHeaderCard: false,

  hasNoImage: computed('organization.{backgroundImageUrl,displayImageUrl}', function() {
    return isBlank(get(this, 'organization.backgroundImageUrl')) && isBlank(get(this, 'organization.displayImageUrl'));
  }),

  organizationDescription: computed('organization.description', function() {
    return htmlSafe(get(this, 'organization.description'));
  }),

  actions: {
    toggleDescription() {
      this.toggleProperty('isDescriptionExpanded');
    }
  }
});
