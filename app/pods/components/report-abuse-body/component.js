import Component from '@ember/component';
import { set, get, setProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import TestSelector from 'subtext-app/mixins/components/test-selector';

export default Component.extend(TestSelector, {
  'data-test-component': 'report-abuse-link',
  classNames: ['ReportAbuse'],

  api: service(),

  showSuccess: false,
  isInvalid: false,
  isPreview: false,
  flagType: null,

  init() {
    this._super(...arguments);
    setProperties(this, {
      flagTypes: ['Offensive', 'Personal Attack', 'Spam']
    });
  },

  _resetProperties() {
    setProperties(this, {
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
      const contentId = get(this, 'contentId');
      const contentType = get(this, 'contentType');
      const api = get(this, 'api');

      if (flagType) {
        api.reportAbuse(contentId, contentType, flagType).then(() => {
          set(this, 'showSuccess', true);
        });
      } else {
        set(this, 'isInvalid', true);
      }
    }
  }
});
