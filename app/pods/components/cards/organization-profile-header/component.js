import Ember from 'ember';

const {get, computed, isBlank, isPresent, inject} = Ember;

export default Ember.Component.extend({
  classNames: 'OrganizationProfileHeaderCard',

  organization: null,
  isProfileHeader: false,
  showBlankBackgroundImage: false,
  onlyShowCityAndState: false,
  noShadow:false,

  fastboot: inject.service(),

  backgroundImageSize: computed('isProfileHeader', function() {
    return get(this, 'isProfileHeader') ? 'smallOnMobileMediumOnDesktop' : 'small';
  }),

  hasNoImage: computed('organization.{backgroundImageUrl,displayImageUrl}', function() {
    return isBlank(get(this, 'organization.backgroundImageUrl')) && isBlank(get(this, 'organization.displayImageUrl'));
  }),

  showGearButton: computed('session.isAuthenticated', 'fastboot.isFastBoot', function() {
    return !get(this, 'session.isAuthenticated') && !get(this, 'fastboot.isFastBoot');
  }),

  showBackgroundImage: computed('organization.backgroundImageUrl', 'showBlankBackgroundImage', function() {
    return isPresent(get(this, 'organization.backgroundImageUrl')) || get(this, 'showBlankBackgroundImage');
  }),

  backgroundImageUrl: computed('organization.backgroundImageUrl', 'showBlankBackgroundImage', function() {
    return get(this, 'showBlankBackgroundImage') ? false : get(this, 'organization.backgroundImageUrl');
  }),

  addressToShow: computed('onlyShowCityAndState', function() {
    let addressToShow;
    if (get(this, 'onlyShowCityAndState')) {
      addressToShow = `${get(this, 'organization.city')}, ${get(this, 'organization.state')}`;
    } else {
      addressToShow = get(this, 'organization.fullAddress');
    }

    return addressToShow;
  })
});
