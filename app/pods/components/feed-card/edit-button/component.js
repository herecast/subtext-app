import Ember from 'ember';

const { inject, computed, get, set } = Ember;

export default Ember.Component.extend({
  classNameBindings: ['canEdit:can-edit-button-active'],

  session: inject.service(),
  currentService: inject.service('currentController'),
  contentPermissions: inject.service('content-permissions'),
  canEdit: false,
  model: null,

  editPath: null,
  editPathId: null,
  iconSize: null,
  color: null,
  style: null,

  currentPath: computed.readOnly('currentService.currentPath'),
  fromProfile: computed('currentPath', function() {
    return get(this,'currentPath').startsWith('profile');
  }),
  contentOrganizationId: computed('fromProfile', 'model.organizationId', function() {
    if (get(this, 'fromProfile')) {
      return get(this, 'model.organizationId') || null;
    }

    return null;
  }),

  init() {
    get(this, 'session').on('authenticationSucceeded', this, '_setPermissions');
    get(this, 'session').on('invalidationSucceeded', this, '_setPermissions');
    this._super(...arguments);
    const contentId = get(this, 'model.contentId');
    const contentPermissions = get(this, 'contentPermissions');

    contentPermissions.canEdit(contentId).then((permission) => {
      if(!get(this, 'isDestroying')) {
        set(this, 'canEdit', permission);
      }
    });
  },

  _setPermissions: function () {
    const contentId = get(this, 'model.contentId');
    const contentPermissions = get(this, 'contentPermissions');
    contentPermissions.canEdit(contentId).then((permission) => {
      if(!get(this, 'isDestroying')) {
        set(this, 'canEdit', permission);
      }
    });
  }
});
