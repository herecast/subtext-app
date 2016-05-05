import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('content-form-image', 'Integration | Component | content form image', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{content-form-image}}`);

  assert.ok(this.$().text().trim().match(/^Choose Image/));

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#content-form-image}}
      template block text
    {{/content-form-image}}
  `);

  assert.ok(this.$().text().trim().match(/^Choose Image/));
});
