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

  actions: {
    reportAbuse() {
      const isPreview = get(this, 'isPreview');

      if(!isPreview) {
        this._trackReportAbuseClick();
        get(this, 'modals').showModal('modals/report-abuse', {
          contentId: get(this, 'contentId'),
          close: get(this, 'close') // action passed in from upper context
        });
      }
    }
  }
});
