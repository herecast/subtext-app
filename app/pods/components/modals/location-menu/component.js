import Ember from 'ember';
import ModalInstance from 'subtext-ui/pods/components/modal-instance/component';

const { get, set, inject, computed } = Ember;

export default ModalInstance.extend({
  store: inject.service(),
  userLocation: inject.service(),
  tracking: inject.service(),
  isLoading: false,

  currentLocation: computed('userLocation.location.id', 'model.location.id', function() {
    return get(this, 'model.location') || get(this, 'userLocation.location');
  }),

  init() {
    this._super(...arguments);

    set(this, 'isLoading', true);
    // Query so only locations returned by API are displayed.
    // Not what's currently in the store.
    get(this, 'store').query('location', {}).then((locations)=>{
      set(this, 'isLoading', false);
      set(this, 'locations', locations);
    });

    get(this, 'tracking').push({
      event: 'OpenLocationSelectionModal'
    });
  },

  actions: {
    chooseLocation(location) {
      this.close();
      get(this, 'model.onChooseLocation')(location);
    }
  }

});
