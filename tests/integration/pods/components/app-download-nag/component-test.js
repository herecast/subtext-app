import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('app-download-nag', 'Integration | Component | app download nag', {
  integration: true
});

test('it renders', function(assert) {

  this.render(hbs`{{app-download-nag}}`);

  assert.ok(this.$());

});
