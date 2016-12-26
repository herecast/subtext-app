import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('subscribe-banner', 'Integration | Component | subscribe banner', {
  integration: true
});

test('it renders', function(assert) {
  this.set('actions.subscribe', () => {});

  this.render(hbs`{{subscribe-banner subscribe=(action 'subscribe')}}`);

  assert.ok(this.$().text().trim());
});
