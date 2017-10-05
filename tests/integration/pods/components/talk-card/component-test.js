import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('talk-card', 'Integration | Component | talk card', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  //
  this.set('model', {contentId: 1});

  this.render(hbs`{{talk-card talk=model}}`);

  assert.ok(this.$().text().trim());
});
