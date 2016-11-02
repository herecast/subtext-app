import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('market-cta', 'Integration | Component | market cta', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{market-cta}}`);

  assert.equal(this.$('[data-test-component="market-cta"]').length, 1);
});
