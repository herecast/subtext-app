import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('organization', 'Unit | Model | organization', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

test('slug is equal to id plus title, dasherized.', function(assert) {
  let model = this.subject();

  Ember.run(()=> {
    model.setProperties({id: 5, name: "White River Pizza"});
  });

  assert.equal(model.get('slug'), "5-white-river-pizza");

});
