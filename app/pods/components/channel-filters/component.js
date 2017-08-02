import Ember from 'ember';

const {
  get,
  inject
} = Ember;

export default Ember.Component.extend({
  tracking: inject.service(),
  classNames: ['ChannelFilters'],

  actions: {
    trackMyStuff() {
      get(this, 'tracking').push({
        event: 'ChangeRadius',
        channel: get(this, 'channel'),
        new_value: 'myStuff'
      });

      return true;
    }
  }
});
