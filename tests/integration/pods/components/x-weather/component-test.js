import { moduleForComponent, skip } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';
import startMirage from '../../../../helpers/setup-mirage';

moduleForComponent('x-weather', 'Integration | Component | x weather', {
  integration: true,
  setup: function() {
    startMirage(this.container);
  }
});

skip('it renders', function(assert) {
  assert.expect(1);

  this.render(hbs`{{x-weather}}`);

  return wait().then(() => {
    assert.equal(this.$().text().trim(), '80° Clear');
  });
});
