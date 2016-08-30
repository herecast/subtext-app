import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from '../../../../helpers/setup-mirage';

moduleForComponent('talk-detail', 'Integration | Component | talk detail', {
  integration: true,
  setup() {
    startMirage(this.container);
  }
});

test('it renders', function(assert) {
  assert.expect(1);
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('model', {});

  this.render(hbs`{{talk-detail model=model}}`);

  assert.ok(this.$());
});
