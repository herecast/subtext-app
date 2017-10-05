import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('small-card', 'Integration | Component | small card', {
  integration: true
});

test('it renders', function(assert) {
  this.set('model', {contentId:123});

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{small-card item=model}}`);
  assert.ok(this.$());
});
