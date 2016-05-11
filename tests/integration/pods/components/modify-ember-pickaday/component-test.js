import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('modify-ember-pickaday', 'Integration | Component | modify ember pickaday', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{modify-ember-pickaday}}`);

  assert.equal(this.$().text().trim(), '');
});
