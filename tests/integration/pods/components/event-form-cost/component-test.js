import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('event-form-cost', 'Integration | Component | event form cost', {
  integration: true
});

test('not applicable chosen hides the input box', function(assert) {
  this.render(hbs`{{event-form-cost costType=null}}`);
  assert.ok(this.$('input.notapplicable').length === 0);
});

test('free option chosen shows the input box', function(assert) {
  this.render(hbs`{{event-form-cost costType='free'}}`);
  assert.ok(this.$('input.notapplicable').length > 0);
});
