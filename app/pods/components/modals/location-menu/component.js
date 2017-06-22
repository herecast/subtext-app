import Ember from 'ember';
import ModalInstance from 'subtext-ui/pods/components/modal-instance/component';

const { get, set, inject } = Ember;

export default ModalInstance.extend({
  store: inject.service(),
  isLoading: false,

  init() {
    this._super(...arguments);

    set(this, 'isLoading', true);
    // Query so only locations returned by API are displayed.
    // Not what's currently in the store.
    get(this, 'store').query('location', {}).then((locations)=>{
      set(this, 'isLoading', false);
      set(this, 'locations', locations);
    });
  }

});
