import Ember from 'ember';

const { get, inject } = Ember;

export default Ember.Mixin.create({
  toast: inject.service(),

  afterModel(model) {
    this._super(...arguments);

    if(!get(model, 'canEdit')) {
      get(this, 'toast').error('You must be signed in as the content owner to edit this resource.');
      this.transitionTo('index');
    }
  }
});
