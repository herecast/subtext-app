import Ember from 'ember';

const {
  get,
  computed,
  inject
} = Ember;

export default Ember.Component.extend({
  classNames: ['ChannelFilters'],

  userLocation: inject.service(),

  radius: '10',
  isMyStuffOnly: computed.equal('radius', 'myStuff'),

  actions: {
    chooseMyStuffOnly() {
      const onChooseMyStuffOnly = get(this, 'onChooseMyStuffOnly');
      if (onChooseMyStuffOnly) {
        onChooseMyStuffOnly();
      }
    }
  }
});
