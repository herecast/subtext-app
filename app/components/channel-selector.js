import Ember from 'ember';

const {
  get,
  computed
} = Ember;

export default Ember.Component.extend({
  attributeBindings: ['data-test-component', 'data-test-channel'],
  'data-test-component': 'channel-selector',
  'data-test-channel': computed('name', function() {
    return get(this, 'name').toLowerCase();
  }),

  classNames: ['ChannelSelector'],
  classNameBindings: ['isActive:is-active'],

  selectChannel: Ember.K
});
