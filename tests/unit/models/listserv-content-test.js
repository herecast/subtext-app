import { moduleForModel, test } from 'ember-qunit';

moduleForModel('listserv-content', 'Unit | Model | listserv content', {
  // Specify the other units that are required for this test.
  needs: ['model:listserv']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
