import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('line-chart', 'Integration | Component | line chart', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.set('labels', []);
  this.set('data', []);

  this.render(hbs`{{line-chart labels=labels data=data}}`);

  assert.equal(this.$().text().trim(), '');
});
