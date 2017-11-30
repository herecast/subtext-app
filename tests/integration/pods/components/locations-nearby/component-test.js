import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from '../../../../helpers/setup-mirage';

moduleForComponent('locations-nearby', 'Integration | Component | locations nearby', {
  integration: true,
  setup() {
    startMirage(this.container);
  }
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{locations-nearby}}`);
  assert.ok(this.$());
});
