import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('user-menu-identity-switcher', 'Integration | Component | user menu identity switcher', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');

  this.on('openProfileOrMyStuff', function() {});

  this.render(hbs`{{user-menu-identity-switcher openProfileOrMyStuff=(action 'openProfileOrMyStuff')}}`);

  assert.ok(this.$());

});
