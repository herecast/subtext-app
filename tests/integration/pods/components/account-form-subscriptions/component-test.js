import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('account-form-subscriptions', 'Integration | Component | account form subscriptions', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('digests', []);
  this.set('subscriptions', []);

  this.render(hbs`{{account-form-subscriptions digests=digests subscriptions=subscriptions}}`);

  assert.ok(this.$());
});
