import Ember from 'ember';
import ModalInstance from 'subtext-ui/pods/components/modal-instance/component';

const {computed,inject,get} = Ember;

export default ModalInstance.extend({
  tracking: inject.service(),
  isLoading: computed.oneWay('model.locations.isPending'),

  init() {
    this._super(...arguments);

    get(this, 'tracking').push({
      event: 'OpenTownsInRadiusModal',
      near_location_id: get(this, 'model.selectedLocation.id'),
      radius: get(this, 'model.radius')
    });
  }
});
