import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('news-editor', 'Integration | Component | news editor', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{news-editor}}`);

  assert.ok(this.$());
});
