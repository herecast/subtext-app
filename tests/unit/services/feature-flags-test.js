import { moduleFor, skip } from 'ember-qunit';

moduleFor('service:feature-flags', 'Unit | Service | feature flags', {
  needs: ['service:api', 'service:session', 'service:user', 'service:intercom']
});

skip('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});
