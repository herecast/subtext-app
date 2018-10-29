import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';

export default Mixin.create({
  modals: service(),

  deactivate() {
    this._super(...arguments);
    get(this, 'modals').removeModalBodyClass();
  },

  actions: {
    didTransition() {
      this._super(...arguments);

      if (get(this, 'modals.serviceIsActive')) {
        get(this, 'modals').addModalBodyClass();
      }
    }
  }
});
