import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),

  classNames: ['ReportAbuse'],

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
      const eventId = this.get('eventId');

      if (flagType) {
        const url = `/${config.API_NAMESPACE}/events/${eventId}/moderate`;

        ajax(url, {
          type: 'POST',
          data: {flag_type: flagType}
        }).then(() => {
          this.set('showSuccess', true);
          this.send('close');
        });
      } else {
        this.set('invalid', true);
      }
    }
  }
});
