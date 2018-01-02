import Ember from 'ember';

const { inject, get, set } = Ember;

export default Ember.Component.extend({
  tagName: 'span',
  session: inject.service(),
  contentPermissions: inject.service('content-permissions'),
  canEdit: false,

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
