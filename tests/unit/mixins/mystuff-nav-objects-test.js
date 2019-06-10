import EmberObject from '@ember/object';
import MystuffNavObjectsMixin from 'subtext-app/mixins/mystuff-nav-objects';
import { module, test } from 'qunit';

module('Unit | Mixin | mystuff nav objects', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let MystuffNavObjectsObject = EmberObject.extend(MystuffNavObjectsMixin);
    let subject = MystuffNavObjectsObject.create();
    assert.ok(subject);
  });
});
