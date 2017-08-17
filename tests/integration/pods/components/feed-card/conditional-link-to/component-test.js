import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('feed-card/conditional-link-to', 'Integration | Component | feed card/conditional link to', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{feed-card/conditional-link-to}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#feed-card/conditional-link-to}}
      template block text
    {{/feed-card/conditional-link-to}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
