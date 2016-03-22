import Ember from 'ember';
import TrackEvent from 'subtext-ui/mixins/track-event';

const { get, inject } = Ember;

export default Ember.Component.extend(TrackEvent, {
  classNames: ['ReportAbuse'],
  api: inject.service('api'),
  showAbuseReportMenu: false,
  showSuccess: false,
  flagType: null,
  invalid: false,

  revalidate: function() {
    this.set('invalid', false);
  }.observes('flagType'),

  flagTypes: ['Offensive', 'Inflammatory', 'Personal Attack', 'Spam'],

  actions: {
    reportAbuse() {
      this.set('showAbuseReportMenu', true);
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
