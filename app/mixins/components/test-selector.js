import Ember from 'ember';

const { computed } = Ember;

export default Ember.Mixin.create({
  attributeBindings: ['data-test-component'],

  /**
   * _debugContainerKey looks like this: "component:my-component"
   */
  'data-test-component': computed(function() {
    const comName = Object.getPrototypeOf(this)._debugContainerKey;
    return comName.replace('component:', '');
  })
});
