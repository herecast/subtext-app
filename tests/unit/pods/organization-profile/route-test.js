import { moduleFor, test } from 'ember-qunit';
/* global sinon */

moduleFor('route:organization-profile', 'Unit | Route | organization profile', {
  // Specify the other units that are required for this test.
  needs: ['service:history']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});

test('Given a slug, it extracts the id and uses that to find the Organization.', function(assert) {
  assert.expect(2);

  const slug = "5-my-organization-name";
  const record = {id: 5, name: "My Organization Name"};

  let route = this.subject();

  route.store = {
    findRecord: function(name, id) {
      assert.equal(id, '5');
      return record;
    }
  };

  let org = route.model({slug: slug});

  assert.equal(org, record);
});

test('Given a slug with no id in it (malformed), it does not call findRecord.  it returns empty object', function(assert) {

  const slug = "my-organization-name";
  const findRecord = sinon.stub().returns({});

  let route = this.subject();

  route.store = {
    findRecord: findRecord
  };

  let org = route.model({slug: slug});

  assert.notOk(findRecord.called, 'findRecord was not called');
  assert.equal(Object.keys(org).length, 0);
});
