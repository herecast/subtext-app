import EmberObject from '@ember/object';
import ComponentsScrollMaintainerMixin from '../../../../mixins/components/scroll-maintainer';
import { module, test } from 'qunit';

module('Unit | Mixin | components/scroll maintainer', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    var ComponentsScrollMaintainerObject = EmberObject.extend(ComponentsScrollMaintainerMixin);
    var subject = ComponentsScrollMaintainerObject.create();
    assert.ok(subject);
  });
});
