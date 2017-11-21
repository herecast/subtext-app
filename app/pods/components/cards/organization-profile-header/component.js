import Ember from 'ember';

const {get, computed, isBlank, inject} = Ember;

export default Ember.Component.extend({
  classNames: 'OrganizationProfileHeaderCard',

  organization: null,
  isProfileHeader: false,

  fastboot: inject.service(),

  backgroundImageSize: computed('isProfileHeader', function() {
    return get(this, 'isProfileHeader') ? 'smallOnMobileMediumOnDesktop' : 'small';
  }),

  hasNoImage: computed('organization.{backgroundImageUrl,displayImageUrl}', function() {
    return isBlank(get(this, 'organization.backgroundImageUrl')) && isBlank(get(this, 'organization.displayImageUrl'));
  }),

  showGearButton: computed('session.isAuthenticated', 'fastboot.isFastBoot', function() {
    return !get(this, 'session.isAuthenticated') && !get(this, 'fastboot.isFastBoot');
  })
});
