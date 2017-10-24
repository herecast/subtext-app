import Ember from 'ember';

const { get, inject:{service} } = Ember;

export default Ember.Component.extend( {
  tracking: service(),
  modals:   service(),

  isPreview: false,

  _trackReportAbuseClick() {
    get(this, 'tracking').push({
      'event': 'select-report-abuse'
    });
  },

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
