import Ember from 'ember';

const { inject, get } = Ember;

export default Ember.Mixin.create({
  modals: inject.service(),

  removeModalClass: function() {
    get(this, 'modals').removeModalBodyClass();
  }.on('deactivate'),

  actions: {
    didTransition() {
      this._super(...arguments);

      get(this, 'modals').addModalBodyClass();
    }
  }
});
