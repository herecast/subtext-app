import Ember from 'ember';

const { get, inject } = Ember;

export default Ember.Mixin.create({
  notify: inject.service('notification-messages'),

  afterModel(model) {
    this._super(...arguments);

    if(!get(model, 'canEdit')) {
      get(this, 'notify').error('You must be signed in as the content owner to edit this resource.');
      this.transitionTo('index');
    }
  }
});
