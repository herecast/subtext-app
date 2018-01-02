import Ember from 'ember';

const { inject, get, set, RSVP, run } = Ember;

export default Ember.Service.extend({
  api: inject.service(),
  session: inject.service(),
  permissionQueue: {},
  fetchedContentPermissions: {},

  init() {
    this._super(...arguments);
    get(this, 'session').on('authenticationSucceeded', this, '_clearFetchedContentPermissions');
    get(this, 'session').on('invalidationSucceeded', this, '_clearFetchedContentPermissions');
  },

  _clearFetchedContentPermissions() {
    set(this, 'fetchedContentPermissions', {});
  },

  _clearDeferredPromises(deferredPromises, resolvedValue) {
    if (resolvedValue) {
      deferredPromises.forEach((deferredPromise) => {
        deferredPromise.resolve(resolvedValue);
      });
    }
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
        if (content_id) {
          const content_id_as_string = content_id.toString();
          if (permissionQueue[content_id_as_string]) {
            permissionQueue[content_id_as_string].deferredPromises.push(defer);
          } else {
            permissionQueue[content_id_as_string] = {
              content_id: content_id,
              deferredPromises: [defer]
            };
          }
        }
      }

      run.debounce(this, this.process, 200);
    }

    return defer.promise;
  },

  process: function() {
    const api = get(this, 'api');
    const permissionQueue = get(this, 'permissionQueue');
    const contentIdsArray = Object.keys(permissionQueue);
    const fetchedContentPermissions = get(this, 'fetchedContentPermissions');
      api.getContentPermissions(contentIdsArray).then((response) => {
        response.content_permissions.forEach((item) => {
          fetchedContentPermissions[item.content_id] = item.can_edit;
        });

        for (let key in permissionQueue) {
          let fetchedContentPermission = fetchedContentPermissions[key];

          if (fetchedContentPermission !== null) {
            let deferredPromises = permissionQueue[key].deferredPromises;

            this._clearDeferredPromises(deferredPromises, fetchedContentPermission);

            delete permissionQueue[key];
          }
        }
      });
  }
});
