import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('promotion-coupon-cta', 'Integration | Component | promotion coupon cta', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{promotion-coupon-cta}}`);

  assert.equal(this.$('button').length, 1);


});
