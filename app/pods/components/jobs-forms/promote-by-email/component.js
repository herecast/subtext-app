import { get, computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['JobsForms-PromoteByEmail'],

  mailToParts: null,

  onClose: function() {},

  subjectEncoded: computed('mailToParts.subject', function() {
    return encodeURIComponent(get(this, 'mailToParts.subject'));
  }),
  bodyEncoded: computed('mailToParts.body', function() {
    return encodeURIComponent(get(this, 'mailToParts.body'));
  }),

  actions: {
    close() {
      this.onClose();
    }
  }

});
