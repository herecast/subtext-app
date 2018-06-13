import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('feed-carousel/content-card', 'Integration | Component | feed carousel/feed content card', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  const model = {
    contentId: 1
  };
  this.set('model', model);

  this.render(hbs`{{feed-carousel/content-card model=model}}`);

  assert.ok(this.$());
});
