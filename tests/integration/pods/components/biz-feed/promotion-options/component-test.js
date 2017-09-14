import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('biz-feed/promotion-options', 'Integration | Component | biz feed/promote', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('content', {contentId: 1});

  this.render(hbs`{{biz-feed/promotion-options content=content}}`);

  assert.ok(this.$());
});
