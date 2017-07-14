import Ember from 'ember';

const {get, computed, isPresent, inject:{service}} = Ember;

export default Ember.Component.extend({
  classNames: 'BizFeed-Header',

  organziation: null,
  business: null,

  editFormIsVisible: false,
  editBackgroundIsVisible: false,
  editLogoIsVisible: false,

  api: service(),
  store: service(),

  hasBackgroundImage: computed.notEmpty('organization.backgroundImageUrl'),

  headerStyle: computed('organization.backgroundImageUrl', function() {
    const backgroundImageUrl = get(this, 'organization.backgroundImageUrl') || '/images/profile-default-background.png';

    return Ember.String.htmlSafe(`background-image: url('${backgroundImageUrl}');`);
  }),

  hasDetails: computed('business.details', function() {
    const details = get(this, 'business.details');
    const snipped = isPresent(details) ? details.replace(/(<([^>]+)>)/ig,"") : '';
    return snipped.length > 0;
  }),

  hasHours: computed.notEmpty('business.hours'),
  hasCustomLinks: computed.gt('organization.customLinks.length', 0),

  businessDetails: computed('business.details', function() {
    return Ember.String.htmlSafe(get(this, 'business.details'));
  }),

  avatarUrl: computed('organization.{logoUrl,profileImageUrl}', function() {
    const profileImageUrl = get(this, 'organization.profileImageUrl');
    const logoUrl = get(this, 'organization.logoUrl');

    return isPresent(profileImageUrl) ? profileImageUrl : (isPresent(logoUrl) ? logoUrl : null);
  }),

  actions: {
    toggleEditForm() {
      this.toggleProperty('editFormIsVisible');
    },

    toggleBackgroundEditor() {
      this.toggleProperty('editBackgroundIsVisible');
    },

    toggleLogoEditor() {
      this.toggleProperty('editLogoIsVisible');
    },

    saveBackgroundImage() {
      const organization = get(this, 'organization');
      const organizationModel = get(this, 'store').peekRecord('organization', get(organization, 'id'));
      const backgroundImageBlob = get(this, 'organization.backgroundImage');

      organizationModel.uploadBackgroundImage(backgroundImageBlob).then(() => {
        organizationModel.reload();
        this.send('toggleBackgroundEditor');
      });
    },

    saveLogo() {
      const organization = get(this, 'organization');
      const organizationModel = get(this, 'store').peekRecord('organization', get(organization, 'id'));
      const logoBlob = get(this, 'organization.logo');

      organizationModel.uploadLogo(logoBlob).then(() => {
        organizationModel.reload();
        this.send('toggleLogoEditor');
      });
    },

    saveBusinessProfile(alsoDoAction) {
      const businessModel = get(this, 'business');

      businessModel.save();

      if (alsoDoAction) {
        this.send(alsoDoAction);
      }
    },

    resetBusinessProfile(alsoDoAction) {
      const businessModel = get(this, 'business');

      businessModel.rollbackAttributes();

      if (alsoDoAction) {
        this.send(alsoDoAction);
      }
    },

    saveOrganizationProfile(alsoDoAction) {
      const organization = get(this, 'organization');
      const organizationModel = get(this, 'store').peekRecord('organization', get(organization, 'id'));

      organizationModel.save().then(() => {
        if (alsoDoAction) {
          this.send(alsoDoAction);
        }
      });
    },

    resetOrganizationProfile(alsoDoAction) {
      const organization = get(this, 'organization');
      const organizationModel = get(this, 'store').peekRecord('organization', get(organization, 'id'));

      organizationModel.rollbackAttributes();

      if (alsoDoAction) {
        this.send(alsoDoAction);
      }
    }
  }
});
