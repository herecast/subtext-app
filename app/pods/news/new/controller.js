import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['organization_id'],
  organization_id: null,

  fastboot: service(),

  hideEditor: false,

  showLoader: computed('hideEditor', 'fastboot.isFastBoot', function() {
    return get(this, 'hideEditor') || get(this, 'fastboot.isFastBoot');
  }),

  actions: {
    refreshModel() {
      this.send('refreshRouteModel');
    }
  }
});
