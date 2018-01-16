import Ember from 'ember';

const { get, computed, isPresent, inject:{service} } = Ember;

export default Ember.Component.extend({
  attributeBindings: ['data-test-contact-poster-button'],
  classNames: ['ContactPosterButton'],

  model: null,

  canUseContactButton: computed('model.{contactPhone,contactEmail}', function() {
    return isPresent(get(this, 'model.contactPhone')) || isPresent(get(this, 'model.contactEmail'));
  }),

  clickReplyButton() { },

  modals: service(),

  actions: {
    contactPoster() {
      get(this, 'modals').showModal('modals/contact-poster', get(this, 'model'));
    }
  }
});
