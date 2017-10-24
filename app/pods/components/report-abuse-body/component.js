import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const { get, set, inject:{service} } = Ember;

export default Ember.Component.extend(TestSelector, {
  'data-test-component': 'report-abuse-link',
  classNames: ['ReportAbuse'],

  api:      service(),

  showSuccess: false,
  isInvalid: false,
  isPreview: false,

  flagType: null,
  flagTypes: ['Offensive', 'Personal Attack', 'Spam'],

  _resetProperties() {
    this.setProperties({
      isInvalid: false,
      flagType: null
    });
  },

  actions: {
    close() {
      this._resetProperties();
      this.close();
    },

    submit() {
      const flagType = get(this, 'flagType');
      const id = get(this, 'contentId');
      const api = get(this, 'api');

      if (flagType) {
        api.reportAbuse(id, flagType).then(() => {
          set(this, 'showSuccess', true);
        });
      } else {
        set(this, 'isInvalid', true);
      }
    }
  }
});
