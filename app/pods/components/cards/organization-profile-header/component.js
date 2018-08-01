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

  profileIsDisabled: computed.not('organization.profileIsActive'),
  showCustomLinks: computed.not('profileIsDisabled'),

  showDigestButton: computed.notEmpty('organization.digestId'),

  hasNoImage: computed('organization.{backgroundImageUrl,displayImageUrl}', function() {
    return isBlank(get(this, 'organization.backgroundImageUrl')) && isBlank(get(this, 'organization.displayImageUrl'));
  }),

  showProfileImage: computed('organization.profileImageUrl', 'profileIsDisabled', function() {
    if (get(this, 'profileIsDisabled')) {
      return false;
    }

    return isPresent(get(this, 'organization.profileImageUrl'));
  }),

  showBackgroundImage: computed('organization.backgroundImageUrl', 'showBlankBackgroundImage', 'profileIsDisabled', function() {
    if (get(this, 'profileIsDisabled')) {
      return false;
    }

    return isPresent(get(this, 'organization.backgroundImageUrl')) && !get(this, 'showBlankBackgroundImage');
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
