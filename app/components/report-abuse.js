import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import { inject as service } from '@ember/service';

export default Component.extend( {
  tracking: service(),
  modals:   service(),

  message: null,
  isPreview: false,

  _trackReportAbuseClick() {
    get(this, 'tracking').push({
      'event': 'select-report-abuse'
    });
  },

  reportMessage: computed('message', function() {
    const message = get(this, 'message') || null;
    if (isBlank(message)) {
      return 'Report';
    }

    return message;
  }),

  _reportAbuse() {
    this._trackReportAbuseClick();
    get(this, 'modals').showModal('modals/report-abuse', {
      contentId: get(this, 'contentId'),
      contentType: get(this, 'contentType'),
      close: get(this, 'close') // action passed in from upper context
    });
  },

  _sendToSignInRegister() {
    get(this, 'modals').showModal('modals/sign-in-register', {
      model: 'sign-in',
      alternateSignInMessage: 'You must be signed in to flag content.'
    });
  },

  actions: {
    reportAbuse() {
      const isPreview = get(this, 'isPreview');
      
      if (!isPreview) {
        if (get(this, 'session.isAuthenticated')) {
          this._reportAbuse();
        } else {
          this._sendToSignInRegister();
        }
      }
    }
  }
});
