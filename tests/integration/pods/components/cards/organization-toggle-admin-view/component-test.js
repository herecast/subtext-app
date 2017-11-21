import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('cards/organization-toggle-admin-view', 'Integration | Component | cards/organization toggle admin view', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{cards/organization-toggle-admin-view}}`);
  assert.ok(this.$());
});
