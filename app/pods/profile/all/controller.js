import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/controllers/paginated-filter';

const {get, set, setProperties, isPresent, computed, inject, run} = Ember;

export default Ember.Controller.extend(PaginatedFilter, {
  session: inject.service(),
  notify: inject.service('notification-messages'),
  tracking: inject.service(),

  profileController: inject.controller('profile'),
  organization: computed.oneWay('profileController.model'),

  queryParams: ['page', 'query', 'show'],
  page: 1,
  query: '',
  show: null,

  visibleFeedItems: computed('model.@each.feedContent.viewStatus', 'show', function() {
    const model = get(this, 'model');
    const show = get(this, 'show');

    switch(show) {
      case 'everything':
        return model;
      case 'draft':
        return model.filterBy('feedContent.viewStatus', 'draft');
      case 'hidden':
        return model.filterBy('feedContent.viewStatus', 'private');
      default:
        return model.filterBy('feedContent.viewStatus', 'public');
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

  showContactCard: computed('showAdminCards', 'organization.contactCardActive', 'organization.hasContactInfo', function() {
    return get(this, 'showAdminCards') || (get(this, 'organization.contactCardActive') && get(this, 'organization.hasContactInfo'));
  }),

  showDescriptionCard: computed('showAdminCards', 'organization.descriptionCardActive', 'organization.description', function() {
    return get(this, 'showAdminCards') || (get(this, 'organization.descriptionCardActive') && get(this, 'organization.description'));
  }),

  showHoursCard: computed('showAdminCards', 'organization.hours', 'organization.hoursCardActive', function() {
    return get(this, 'showAdminCards') || (get(this, 'organization.hours') && get(this, 'organization.hoursCardActive'));
  }),

  showDescriptionHoursTabsCard: computed('showAdminCards', 'showDescriptionCard', 'showHoursCard', function() {
    return ! get(this, 'showAdminCards') && get(this, 'showDescriptionCard') && get(this, 'showHoursCard');
  }),

  updateOrganizationField(fieldName, value) {
    const notify = get(this, 'notify');
    const organization = get(this, 'organization');

    set(organization, fieldName, value);

    organization.save().then(
      () => notify.success('Update successful'),
      () => notify.error('Update failed')
    );
  },

  actions: {
    updateQuery(searchText) {
      setProperties(this, {
        query: searchText,
        page: 1
      });
    },
    updateAdminView(displayAsAdminIfAllowed) {
      set(this, 'show', null);

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
    }
  }
});
