import Ember from 'ember';

const { get, inject:{service} } = Ember;

export default Ember.Component.extend({
  attributeBindings: ['data-test-contact-poster-button'],
  classNames: ['ContactPosterButton'],

  clickReplyButton() { },

  modals: service(),

  actions: {
    contactPoster() {
      get(this, 'modals').showModal('modals/contact-poster', get(this, 'model'));
    }
  }
});
