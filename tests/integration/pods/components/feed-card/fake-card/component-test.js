import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('feed-card/fake-card', 'Integration | Component | feed card/fake card', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{feed-card/fake-card}}`);

  assert.ok(this.$());
});
