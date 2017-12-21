import Ember from 'ember';

const { inject, get, set, RSVP, run } = Ember;

export default Ember.Service.extend({
  api: inject.service(),
  session: inject.service(),
  permissionQueue: [],
  fetchedContentPermissions: {},

  init() {
    this._super(...arguments);
    get(this, 'session').on('authenticationSucceeded', this, '_clearFetchedContentPermissions');
    get(this, 'session').on('invalidationSucceeded', this, '_clearFetchedContentPermissions');
  },

  _clearFetchedContentPermissions() {
    set(this, 'fetchedContentPermissions', {});
  },

  canEdit(content_id) {
    const defer = RSVP.defer();
    const isAuthenticated = get(this, 'session.isAuthenticated');

    if(!isAuthenticated) {
      defer.resolve(false);
    } else {
      const permissionQueue = get(this, 'permissionQueue');
      const fetchedContentPermissions = get(this, 'fetchedContentPermissions');
      if(fetchedContentPermissions[content_id]) {
        defer.resolve(fetchedContentPermissions[content_id]);
      } else {
        permissionQueue.push({
          content_id: content_id,
          deferredPromise: defer
        });
      }

      run.debounce(this, this.process, 200);
    }

    return defer.promise;
  },

  process: function() {
    const api = get(this, 'api');
    const permissionQueue = get(this, 'permissionQueue');
    const contentIdsArray = permissionQueue.mapBy('content_id');
    const fetchedContentPermissions = get(this, 'fetchedContentPermissions');
      api.getContentPermissions(contentIdsArray).then((response) => {
        response.content_permissions.forEach((item) => {
          fetchedContentPermissions[item.content_id] = item.can_edit;
        });

        permissionQueue.forEach((item, index) => {
          if (fetchedContentPermissions[item.content_id] !== null) {
            item.deferredPromise.resolve(fetchedContentPermissions[item.content_id]);
            permissionQueue.splice(index, 1);
          }
        });
      });

  }

});
