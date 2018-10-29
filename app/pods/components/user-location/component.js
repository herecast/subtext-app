import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: 'UserLocation',

  userLocation: service(),

  userLocationName: readOnly('userLocation.userLocation.name'),
  isLoadingLocation: readOnly('userLocation.isLoadingLocation'),

  showLocationName: computed('userLocationName', 'isLoadingLocation', function() {
    return isPresent(get(this, 'userLocationName')) && !get(this, 'isLoadingLocation');
  }),

  actions: {
    clickLocation() {
      if (get(this, 'onClickLocation')) {
        get(this, 'onClickLocation')();
      }
    }
  }
});
