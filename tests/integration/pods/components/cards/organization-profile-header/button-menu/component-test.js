import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('cards/organization-profile-header/button-menu', 'Integration | Component | cards/organization profile header/button menu', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{cards/organization-profile-header/button-menu}}`);
  assert.ok(this.$());
});
