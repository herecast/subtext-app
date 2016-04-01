import Ember from 'ember';
import config from '../config/environment';
import ajax from 'ic-ajax';
import trackEvent from 'subtext-ui/mixins/track-event';

const { inject, get, RSVP, isPresent, computed } = Ember;

export default Ember.Controller.extend(trackEvent, {
  secondaryBackground: true,
  queryParams: ['page', 'per_page', 'sort', 'type'],
  contentModel: inject.service(),
  refresh: null,
  page: 1,
  per_page: 8,
  sort: 'pubdate DESC',
  type: '',
  organization: null,
  organizations: computed.oneWay('session.currentUser.managed_organizations'),

  showPasswordForm: false,

  businesses: computed('organization.id', function() {
    const organizationId = get(this, 'organization.id');

    if (organizationId) {
      return this.store.query('business-profile', {
        organization_id: organizationId
      });
    } else {
      return [];
    }
  }),

  ads: computed('page', 'sort', 'type', 'refresh', 'organization.id', function() {
    const page = get(this, 'page');
    const per_page = get(this, 'per_page');
    const sort = get(this, 'sort');
    const type = get(this, 'type');
    const organizationId = get(this, 'organization.id');

    const queryParams = {
      page: page,
      per_page: per_page,
      sort: sort
    };

    if (organizationId) {
      queryParams.organization_id = organizationId;
    }

    if(type === 'promotion-banner') {
      return this.store.query('promotion-banner', queryParams);
    } else {
      return [];
    }
  }),

  postings: computed('page', 'sort', 'type', 'refresh', 'organization.id', function() {
    const contentModel = get(this, 'contentModel');
    const page = get(this, 'page');
    const per_page = get(this, 'per_page');
    const sort = get(this, 'sort');
    const type = get(this, 'type');
    const organizationId = get(this, 'organization.id');

    const queryParams = [
      `page=${page}`,
      `per_page=${per_page}`,
      `sort=${sort}`
    ];

    if (organizationId) {
      queryParams.push(`organization_id=${organizationId}`);
    }

    if (isPresent(type)) {
      queryParams.push(`channel_type=${type}`);
    }

    if (type === 'promotion-banner' || type === 'business') {
      return [];
    } else {
      const url = `${config.API_NAMESPACE}/dashboard?${queryParams.join('&')}`;
      let promise = new RSVP.Promise((resolve) => {
        ajax(url).then((response) => {

          const contents = response.contents.map((record) => {
            return contentModel.convert(record);
          });

          resolve(contents);
        });
      });

      return Ember.ArrayProxy.extend(Ember.PromiseProxyMixin).create({
        promise: promise
      });
    }
  }),

  contentOwnerName: computed('session.currentUser.name', 'organization.name', function() {
    const orgName = get(this, 'organization.name');

    return orgName ? orgName : get(this, 'session.currentUser.name');
  }),

  organizationId: computed('organization.id', function() {
    const orgId = get(this, 'organization.id');

    // Must return null, not undefined.
    return orgId ? orgId : null;
  }),

  actions: {
    saveUsername() {
      this.trackEvent('selectNavControl', {
        navControlGroup: 'Profile Feature Submit',
        navControl: 'Submit Username Change'
      });

      this.get('currentUser.content').save();
    },

    submit() {
      this.get('currentUser.content').save();
    },

    togglePasswordForm(showPasswordForm) {
      if (!showPasswordForm) {
        this.trackEvent('selectNavControl', {
          navControlGroup: 'Profile Feature Edit',
          navControl: 'password'
        });
      }

      this.toggleProperty('showPasswordForm');
    },

    trackEditName() {
      this.trackEvent('selectNavControl', {
        navControlGroup: 'Profile Feature Edit',
        navControl: 'username'
      });
    },

    sortBy(param) {
      this.setProperties({
        sort: param,
        page: 1
      });
    }
  }
});
