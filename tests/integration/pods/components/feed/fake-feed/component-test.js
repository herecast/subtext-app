import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('feed/fake-feed', 'Integration | Component | feed/fake feed', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{feed/fake-feed}}`);

  assert.ok(this.$());
});
