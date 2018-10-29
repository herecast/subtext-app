import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';

export default Component.extend({
  attributeBindings: ['data-test-contact-poster-button'],
  classNames: ['ContactPosterButton'],

  model: null,

  canUseContactButton: computed('model.{contactPhone,contactEmail}', function() {
    return isPresent(get(this, 'model.contactPhone')) || isPresent(get(this, 'model.contactEmail'));
  }),

  clickReplyButton() {},

  modals: service(),

  actions: {
    contactPoster() {
      this.clickReplyButton();
      get(this, 'modals').showModal('modals/contact-poster', get(this, 'model'));
    }
  }
});
