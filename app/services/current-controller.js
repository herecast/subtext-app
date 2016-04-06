import Ember from 'ember';

const {
  computed,
  get, set
} = Ember;

export default Ember.Service.extend({
  init() {
    this._super(...arguments);

    set(this, 'applicationController', this.container.lookup('controller:application'));
  },
  currentPath: computed.alias('applicationController.currentPath'),
  currentController: computed('currentPath', function() {
    return this.container.lookup(`controller:${get(this,'currentPath')}`);
  }),
  secondaryBackground: computed('currentController.secondaryBackground', function() {
    return get(this, 'currentController.secondaryBackground');
  }),
  secondaryBackgroundMobile: computed('currentController.secondaryBackgroundMobile', function() {
    return get(this, 'currentController.secondaryBackgroundMobile');
  })
});
