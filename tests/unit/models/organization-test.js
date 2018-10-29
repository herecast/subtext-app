import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | organization', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let model = run(() => this.owner.lookup('service:store').createRecord('organization'));
    // let store = this.store();
    assert.ok(!!model);
  });

  test('slug is equal to id plus title, dasherized.', function(assert) {
    let model = run(() => this.owner.lookup('service:store').createRecord('organization'));

    run(()=> {
      model.setProperties({id: 5, name: "White River Pizza"});
    });

    assert.equal(model.get('slug'), "5-white-river-pizza");

  });
});
