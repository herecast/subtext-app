import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('event-form-registration', 'Integration | Component | event form registration', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{event-form-registration}}`);

  assert.ok(this.$().text().trim().match(/registration/), 'Must display placeholder text when disabled');
});
