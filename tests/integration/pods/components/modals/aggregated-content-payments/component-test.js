import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('modals/aggregated-content-payments', 'Integration | Component | modals/aggregated content payments', {
  integration: true
});


test('It renders with a current user model', function(assert) {
  const currentUser = {
    userId: 1
  };

  this.set('currentUser', currentUser);

  this.render(hbs`{{modals/aggregated-content-payments model=currentUser}}`);

  assert.ok(this.$());
});

test('It renders with an organization model', function(assert) {
  const organization = {
    id: 1
  };

  this.set('organization', organization);

  this.render(hbs`{{modals/aggregated-content-payments model=organization}}`);

  assert.ok(this.$());
});
