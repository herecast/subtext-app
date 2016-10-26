import Ember from 'ember';
import TrackEvent from 'subtext-ui/mixins/track-event';

const { get, inject, observer } = Ember;

export default Ember.Component.extend(TrackEvent, {
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

  actions: {
    reportAbuse() {
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
          this.trackEvent('moderateContent',{});
        });
      } else {
        this.set('invalid', true);
      }

      this.trackEvent('selectNavControl', {
        navControlGroup: 'Report Abuse',
        navControl: get(this, 'flagType')
      });
    }
  }
});
