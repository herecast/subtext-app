import EmberObject from '@ember/object';
import ComponentsLaunchingContentMixin from 'subtext-ui/mixins/components/launching-content';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Mixin | components/launching-content', function(hooks) {
  setupTest(hooks);
  // Replace this with your real tests.
  test('it works', function (assert) {
    let ComponentsLaunchingContentObject = EmberObject.extend(ComponentsLaunchingContentMixin);
    let subject = ComponentsLaunchingContentObject.create(this.owner.ownerInjection());
    assert.ok(subject);
  });
});
