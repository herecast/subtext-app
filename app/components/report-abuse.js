import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const { get, inject, observer } = Ember;

export default Ember.Component.extend(TestSelector, {
  tracking: inject.service(),

  'data-test-component': 'report-abuse-link',
  classNames: ['ReportAbuse'],
  api: inject.service('api'),
  showAbuseReportMenu: false,
  showSuccess: false,
  flagType: null,
  invalid: false,
  isPreview: false,

  revalidate: observer('flagType', function() {
    this.set('invalid', false);
  }),

  flagTypes: ['Offensive', 'Inflammatory', 'Personal Attack', 'Spam'],

  _trackReportAbuseClick() {
    get(this, 'tracking').push({
      'event': 'select-report-abuse'
    });
  },

  actions: {
    reportAbuse() {
      this._trackReportAbuseClick();
      const isPreview = get(this, 'isPreview');
      if(!isPreview) {
        this.set('showAbuseReportMenu', true);
      }
    },

    close() {
      this.setProperties({
        showAbuseReportMenu: false,
        invalid: false,
        flagType: null
      });
    },

    submit() {
      const flagType = this.get('flagType');
      const id = this.get('contentId');
      const api = get(this, 'api');

      if (flagType) {
        api.reportAbuse(id, flagType).then(() => {
          this.set('showSuccess', true);
          this.send('close');
        });
      } else {
        this.set('invalid', true);
      }
    }
  }
});
