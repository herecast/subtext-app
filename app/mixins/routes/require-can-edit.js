import Ember from 'ember';

const { get, inject } = Ember;

export default Ember.Mixin.create({
  notify: inject.service('notification-messages'),
  permissions: inject.service('content-permissions'),

  afterModel(model) {
    this._super(...arguments);

    return get(this, 'permissions').canEdit(get(model, 'contentId')).then((canEdit) => {
      if(!canEdit) {
        get(this, 'notify').error('You must be signed in as the content owner to edit this resource.');
        this.transitionTo('index');
      }
    });
  }
});
