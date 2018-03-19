import Ember from 'ember';

const {get, set, setProperties, isPresent, computed, inject:{service,controller}, run} = Ember;

export default Ember.Controller.extend({
  userLocation: service(),
  session: service(),
  notify: service('notification-messages'),
  tracking: service(),

  profileController: controller('profile'),
  organization: computed.oneWay('profileController.model'),
  profileIsDisabled: computed.not('organization.profileIsActive'),

  isFirstTransition: true,
  condensedView: false,

  queryParams: ['page', 'perPage', 'query', 'show', 'location'],
  page: 1,
  perPage: 5,
  query: '',
  show: null,
  location: '',

  locationForControls: computed('userLocation.location.id', function() {
    return get(this, 'userLocation.location');
  }),

  isLocationDependentProfile: computed.alias('organization.isLocationDependentOrganization'),

  visibleFeedItems: computed('model.@each.viewStatus', 'show', function() {
    const model = get(this, 'model') || [];
    const show = get(this, 'show');

    switch(show) {
      case 'everything':
        return model;
      case 'draft':
        return model.filterBy('viewStatus', 'draft');
      case 'hidden':
        return model.filterBy('viewStatus', 'private');
      default:
        return model.filterBy('viewStatus', 'public');
    }
  }),

  displayAsAdminIfAllowed: true,
  managedOrganizations: computed.alias('session.currentUser.managedOrganizations'),

  isAdmin: computed('session.isAuthenticated', 'managedOrganizations.@each.id', 'organization.id', function() {
    const managedOrganizations = get(this, 'managedOrganizations') || [];
    return isPresent(managedOrganizations.findBy('id', String(get(this, 'organization.id'))));
  }),

  showAdminCards: computed.and('isAdmin', 'displayAsAdminIfAllowed'),
  stickyContainerEnabled: computed.not('showAdminCards'),

  avatarUrl: computed('profileIsDisabled', 'organization.profileImageUrl', function() {
    if (get(this, 'profileIsDisabled')) {
      return false;
    }

    return get(this, 'organization.profileImageUrl');
  }),

  allowToEditHeader: computed('showAdminCards', 'profileIsDisabled', function() {
    if (get(this, 'profileIsDisabled')) {
      return false;
    }

    return get(this, 'showAdminCards');
  }),

  showContactCard: computed('showAdminCards', 'organization.contactCardActive', 'organization.hasContactInfo', function() {
    return get(this, 'showAdminCards') || (get(this, 'organization.contactCardActive') && get(this, 'organization.hasContactInfo'));
  }),

  showDescriptionCard: computed('showAdminCards', 'profileIsDisabled', 'organization.descriptionCardActive', 'organization.description', function() {
    if (get(this, 'profileIsDisabled')) {
      return false;
    }

    return get(this, 'showAdminCards') || (get(this, 'organization.descriptionCardActive') && get(this, 'organization.description'));
  }),

  showHoursCard: computed('showAdminCards', 'organization.hours', 'organization.hoursCardActive', function() {
    return get(this, 'showAdminCards') || (isPresent(get(this, 'organization.hours')) && get(this, 'organization.hoursCardActive'));
  }),

  showDescriptionHoursTabsCard: computed('showAdminCards', 'showDescriptionCard', 'showHoursCard', function() {
    return ! get(this, 'showAdminCards') && get(this, 'showDescriptionCard') && get(this, 'showHoursCard');
  }),

  showCreateContentCards: computed('showAdminCards', 'profileIsDisabled', function() {
    if (get(this, 'profileIsDisabled')) {
      return false;
    }

    return get(this, 'showAdminCards');
  }),

  hasPaidProfile: computed.alias('organization.bizFeedActive'),

  updateOrganizationField(fieldName, value) {
    const notify = get(this, 'notify');
    const organization = get(this, 'organization');

    set(organization, fieldName, value);

    organization.save().then(
      () => notify.success('Update successful'),
      () => notify.error('Update failed')
    );
  },

  mailtoHref: computed('isAdmin', 'organization', function() {
    const organization = get(this, 'organization');

    let email,
      subject;

    if (get(this, 'isAdmin')) {
      subject = encodeURIComponent(`Profile Page Manager's Query [${get(organization, 'name')}|${organization.id}]`);
      email = `ads@dailyuv.com`;
    } else {
      subject = encodeURIComponent(`Profile Page Query [${get(organization, 'name')}|${organization.id}]`);
      email = `dailyuv@subtext.org`;
    }

    return Ember.String.htmlSafe(`mailto:${email}?subject=${subject}`);
  }),

  actions: {
    updateQuery(searchText) {
      setProperties(this, {
        query: searchText,
        page: 1
      });
    },
    updateAdminView(displayAsAdminIfAllowed) {
      set(this, 'show', null);

      if (!displayAsAdminIfAllowed) {
        set(this, 'condensedView', false);
      }

      // Avoid glimmer double-render error. using `setProperties` did not prevent it.
      run.next(() => {
        set(this, 'displayAsAdminIfAllowed', displayAsAdminIfAllowed);
      });
    },
    toggleContactCard(visibility) {
      this.updateOrganizationField('contactCardActive', visibility);
    },
    toggleDescriptionCard(visibility) {
      this.updateOrganizationField('descriptionCardActive', visibility);
    },
    toggleHoursCard(visibility) {
      this.updateOrganizationField('hoursCardActive', visibility);
    },

    onChooseLocation(location) {
      const userLocation = get(this, 'userLocation');

      get(this, 'tracking').push({
        event: "ChooseLocation",
        location_id: get(userLocation, 'location.id'),
        new_location_name: get(location, 'name'),
        new_location_id: get(location, 'id')
      });

      userLocation.saveSelectedLocationId(get(location, 'id'));
      set(this, 'location', get(location, 'id'));
    },

    onChooseMyStuffOnly() {
      this.transitionToRoute('feed', {
        queryParams: {
          radius: 'myStuff'
        }
      });
    },

    toggleCondensedView() {
      this.toggleProperty('condensedView');
    }
  }
});
