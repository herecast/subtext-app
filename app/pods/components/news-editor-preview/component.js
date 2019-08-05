import Component from '@ember/component';
import { get } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  media: service(),

  isMobile: readOnly('media.isMobile'),

  actions: {
    closePreview() {
      get(this, 'closePreview')();
    }
  }
});
