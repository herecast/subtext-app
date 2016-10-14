import Ember from 'ember';
import trackEvent from 'subtext-ui/mixins/track-event';

const {
  inject,
  get,
  set,
  RSVP,
  isPresent,
  computed,
  observer
} = Ember;

export default Ember.Controller.extend(trackEvent, {
  api: inject.service(),
  toast: inject.service(),
  secondaryBackground: true,
  queryParams: ['page', 'per_page', 'sort', 'type', 'organization_id'],
  contentModel: inject.service(),
  refresh: null,
  page: 1,
  per_page: 8,
  sort: 'pubdate DESC',
  type: '',
  organization_id: null,
  organization: null,
  setOrganization: observer('organization_id', function() {
    if (get(this, 'organization_id')) {
      this.store.findRecord('organization', get(this, 'organization_id')).then((organization) => {
        set(this, 'organization', organization);
      });
    } else {
      set(this, 'organization', null);
    }
  }),
  organizations: computed.oneWay('session.currentUser.managedOrganizations'),

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
    const api = get(this, 'api');
    const contentModel = get(this, 'contentModel');
    const page = get(this, 'page');
    const per_page = get(this, 'per_page');
    const sort = get(this, 'sort');
    const type = get(this, 'type');
    const organizationId = get(this, 'organization.id');

    let queryParams = {
      page: page,
      per_page: per_page,
      sort: sort
    };

    if (organizationId) {
      queryParams['organization_id'] = organizationId;
    }

    if (isPresent(type)) {
      queryParams['channel_type'] = type;
    }

    if (type === 'promotion-banner') {
      return [];
    } else {
      let promise = new RSVP.Promise((resolve) => {
        api.getDashboard(queryParams).then((response) => {
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
    sortBy(param) {
      this.setProperties({
        sort: param,
        page: 1
      });
    },

    viewProfile(org) {
      if (org.get('isBusiness')) {
        const bid = org.get('businessProfileId');
        this.store.findRecord('business-profile', bid).then((rec)=>{
          this.transitionToRoute('directory.show', rec);
        });
      } else if (org.get('hasProfile')) {
        this.transitionToRoute('organization-profile', org);
      } else {
        alert('Feature not available yet');
      }
    },

    editProfile(org) {
      if (org.get('isBusiness')) {
        const bid = org.get('businessProfileId');
        this.store.findRecord('business-profile', bid).then((rec)=>{
          set(this, 'editingBusiness', rec);
        });
      } else if (org.get('hasProfile')) {
          set(this, 'editingBlog', org);
      } else {
        alert('Feature not available yet');
      }
    },

    cancelEditingBlog() {
      const org = get(this, 'editingBlog');
      if(isPresent(org)) {
        if( org.get('hasDirtyAttributes')) {
          if (confirm('Are you sure you want to discard your changes without saving?')) {
            org.rollbackAttributes();
            set(this, 'editingBlog', null);
          }
        } else {
          set(this, 'editingBlog', null);
        }
      }
    },

    cancelEditingBusiness() {
      const biz = get(this, 'editingBusiness');
      if(isPresent(biz)) {
        if (biz.get('hasDirtyAttributes')) {
          if (confirm('Are you sure you want to discard your changes without saving?')) {
            biz.rollbackAttributes();
            set(this, 'editingBusiness', null);
          }
        } else {
          set(this, 'editingBusiness', null);
        }
      }
    },

    saveBlog() {
      set(this, 'editingBlog', null);
      get(this, 'toast').success('Blog profile saved successfully!');
    },

    saveBusiness() {
      set(this, 'editingBusiness', null);
    },

    updateActiveOrganization({ id }) {
      set(this, 'organization_id', id || null);
    }
  }
});
