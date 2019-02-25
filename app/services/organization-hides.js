import { get, set, computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import { Promise } from 'rsvp';
import Service from '@ember/service';

export default Service.extend({
  api: service(),
  fastboot: service(),
  notify: service('notification-messages'),
  session: service(),
  store: service(),
  tracking: service(),

  organizationHides: null,
  isLoadingOrgId: null,

  currentUser: computed(function() {
    return Promise.resolve( get(this, 'session.currentUser') );
  }),

  init() {
    this._super(...arguments);

    get(this, 'session').on('authenticationSucceeded', () => {
      this._getHides(true);
    });
    this._getHides();
  },

  _getHides(removeOrganizationContent=false) {
    if (get(this, 'session.isAuthenticated') && !get(this, 'fastboot.isFastBoot')) {
      get(this, 'currentUser').then(() => {
        const organizationHides = get(this, 'store').peekAll('organization-hide');

        set(this, 'organizationHides', organizationHides);

        if (removeOrganizationContent) {
          organizationHides.forEach((organizationHide) => {
            this.removeOrganizationContent(get(organizationHide, 'organizationId'));
          });
        }
      });
    }
  },

  _getHide(organizationId) {
    const organizationHides = get(this, 'organizationHides') || [];

    const matchingHide = organizationHides.find((organizationHide) => {
      if (isPresent(organizationHide)) {
        return parseInt(organizationId) === parseInt(get(organizationHide, 'organizationId'));
      }
      return false;
    });

    return matchingHide || null;
  },

  _addHideToCurrentUser(organizationHide) {
    if (get(this, 'session.isAuthenticated')) {
      get(this, 'currentUser').then(currentUser => {
        const organizationHides = get(this, 'organizationHides');
        organizationHides.pushObject(organizationHide);
        set(currentUser, 'organizationHides', organizationHides);
      });
    }
  },

  _getOrganization(organizationId) {
    return new Promise((resolve) => {
      let organization = get(this, 'store').peekRecord('organization', organizationId);

      if (isPresent(get(organization, 'id'))) {
        resolve(organization);
      } else {
        return get(this, 'store').findRecord('organization', organizationId);
      }
    });
  },

  removeOrganizationContent(organizationId) {
    return new Promise((resolve) => {
      const eventInstances = get(this, 'store').peekAll('event-instance');
      eventInstances.forEach((eventInstance) => {
        let eventInstanceOrganizationId = get(eventInstance, 'organizationId');
        if (parseInt(eventInstanceOrganizationId) === parseInt(organizationId)) {
          set(eventInstance, 'isHiddenFromFeed', true);
        }
      });

      const contents = get(this, 'store').peekAll('content');
      contents.forEach((content) => {
        let contentOrganizationId = get(content, 'organizationId');
        if (parseInt(contentOrganizationId) === parseInt(organizationId)) {
          set(content, 'isHiddenFromFeed', true);
        }
      });

      return resolve();
    });
  },

  hide(organizationId, contentId, flagType) {
    if (get(this, 'session.isAuthenticated')) {
      set(this, 'isLoadingOrgId', organizationId);

      const newHide = get(this, 'store').createRecord('organization-hide', {
        organizationId,
        contentId,
        flagType
      });

      get(this, 'tracking').trackHideAuthor(newHide);
      
      return newHide.save()
      .then(() => {
        this._getHides();
      })
      .catch(() => {
        get(this, 'notify').error('There was a problem hiding. Please reload page and try again.');
      })
      .finally(() => {
        set(this, 'isLoadingOrgId', null);
      });
    }
  },

  unhide(organizationId) {
    set(this, 'isLoadingOrgId', organizationId);

    const hide = this._getHide(organizationId);

    get(this, 'tracking').trackUnhideAuthor(hide);

    if (isPresent(hide)) {
      return hide.destroyRecord()
      .catch(() => {
        get(this, 'notify').error('There was a problem unhiding. Please reload page and try again.');
      })
      .finally(() => {
        set(this, 'isLoadingOrgId', null);
      });
    }
  }
});
