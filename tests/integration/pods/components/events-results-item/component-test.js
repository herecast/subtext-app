import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('events-results-item', 'Integration | Component | events results item', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  const model = {
    title: ''
  };

  this.set('model', model);

  this.render(hbs`{{events-results-item model=model}}`);

  assert.ok(1);


});
