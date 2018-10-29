import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({
  attributeBindings: ['data-test-component'],

  /**
   * _debugContainerKey looks like this: "component:my-component"
   */
  'data-test-component': computed(function() {
    if (typeof FastBoot === 'undefined') {
      const comName = this._debugContainerKey;
      return comName.replace('component:', '');
    }
  })
});
