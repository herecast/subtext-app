import {
  oneWay,
  not,
  gt,
  alias,
  readOnly,
  and
} from '@ember/object/computed';
import { htmlSafe } from '@ember/template';
import { isPresent } from '@ember/utils';
import { computed, setProperties, set, get } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller, { inject as controller } from '@ember/controller';
import { run } from '@ember/runloop';

export default Controller.extend({
  session: service(),
  notify: service('notification-messages'),
  tracking: service(),

  profileController: controller('profile'),
  organization: oneWay('profileController.model'),
  profileIsDisabled: not('organization.profileIsActive'),

  isFirstTransition: true,
  initialLoad: true,

  queryParams: ['page', 'perPage', 'query', 'show', 'location', 'resetController'],
  page: 1,
  perPage: 5,
  query: '',
  show: null,
  location: '',
  resetController: null,

  _resetDefaults() {
    setProperties(this, {
      page: 1,
      perPage: 5,
      query: '',
      show: null,
      location: '',
      resetController: null,
    });
  },

  displayAsAdminIfAllowed: false,
  firstLoad: true,

  feedItemsView: 'default',
  showDefaultView: computed('feedItemsView', 'showAdminCards', function() {
    return get(this, 'feedItemsView') === 'default' || get(this, 'showAdminCards');
  }),
  showCalendarView: computed('feedItemsView', 'showAdminCards', function() {
    return get(this, 'feedItemsView') === 'calendar' && !get(this, 'showAdminCards');
  }),
  showPostsOnlyView: computed('feedItemsView', 'showAdminCards', function() {
    return get(this, 'feedItemsView') === 'postsOnly' && !get(this, 'showAdminCards');
  }),

  nothingShowingText: computed('show', function() {
    const show = get(this, 'show') || null;

    if (show === null) {
      return 'published';
    } else if (show === 'hidden') {
      return 'hidden';
    } else if (show === 'draft') {
      return 'draft';
    } else {
      return '';
    }
  }),

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

  hasResults: gt('model.length', 0),

  managedOrganizations: alias('session.currentUser.managedOrganizations'),

  isAdmin: computed('session.isAuthenticated', 'managedOrganizations.@each.id', 'organization.id', function() {
    const managedOrganizations = get(this, 'managedOrganizations') || [];
    return isPresent(managedOrganizations.findBy('id', String(get(this, 'organization.id'))));
  }),

  isBlog: readOnly('organization.isBlog'),

  showAdminCards: and('isAdmin', 'displayAsAdminIfAllowed'),
  stickyContainerEnabled: not('showAdminCards'),

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

  showContactCard: computed('showAdminCards', 'organization.{contactCardActive,hasContactInfo}', function() {
    return get(this, 'showAdminCards') || (get(this, 'organization.contactCardActive') && get(this, 'organization.hasContactInfo'));
  }),

  showDescriptionCard: computed('showAdminCards', 'profileIsDisabled', 'organization.{descriptionCardActive,description}', function() {
    if (get(this, 'profileIsDisabled')) {
      return false;
    }

    return get(this, 'showAdminCards') || (get(this, 'organization.descriptionCardActive') && get(this, 'organization.description'));
  }),

  showHoursCard: computed('showAdminCards', 'organization.{hours,hoursCardActive}', function() {
    return get(this, 'showAdminCards') || (isPresent(get(this, 'organization.hours')) && get(this, 'organization.hoursCardActive'));
  }),

  showDescriptionHoursTabsCard: computed('showAdminCards', 'showDescriptionCard', 'showHoursCard', function() {
    return ! get(this, 'showAdminCards') && get(this, 'showDescriptionCard') && get(this, 'showHoursCard');
  }),

  showCalendarCard: computed('showAdminCards', 'profileIsDisabled', 'organization.calendarCardActive', 'isBlog', function() {
    if (get(this, 'profileIsDisabled') || get(this, 'isBlog')) {
      return false;
    }

    return get(this, 'showAdminCards') || (get(this, 'organization.calendarCardActive'));
  }),

  showCreateContentCards: computed('showAdminCards', 'profileIsDisabled', function() {
    if (get(this, 'profileIsDisabled')) {
      return false;
    }

    return get(this, 'showAdminCards');
  }),

  hasPaidProfile: alias('organization.bizFeedActive'),

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
      email = `ads@HereCast.us`;
    } else {
      subject = encodeURIComponent(`Profile Page Query [${get(organization, 'name')}|${organization.id}]`);
      email = `help@herecast.com`;
    }

    return htmlSafe(`mailto:${email}?subject=${subject}`);
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
        set(this, 'feedItemsView', 'default');
      }

      // Avoid glimmer double-render error. using `setProperties` did not prevent it.
      run.next(() => {
        set(this, 'displayAsAdminIfAllowed', displayAsAdminIfAllowed);
        get(this, 'target').send('refreshForCalendar', true);
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
    toggleCalendarCard(visibility) {
      this.updateOrganizationField('calendarCardActive', visibility);
    },

    toggleFeedItemsView(showCalendar) {
      const feedItemsView = showCalendar ? 'calendar' : 'postsOnly';
      set(this, 'feedItemsView', feedItemsView);

      const showAdminCards = get(this, 'showAdminCards');

      if (!showAdminCards) {

        get(this, 'target').send('refreshForCalendar');
      }
    },

    onChooseMyStuffOnly() {
      this.transitionToRoute('mystuff');
    }
  }
});
