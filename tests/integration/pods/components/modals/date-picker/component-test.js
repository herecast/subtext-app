import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForComponent('modals/date-picker', 'Integration | Component | modals/date picker', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`
    {{modals/date-picker}}
  `);

  // assert.ok(this.$().text().trim().match(/^Choose Date/i));

  const $modalDialog = this.$(testSelector('modal', 'datepicker'));

  assert.ok($modalDialog.length === 1, "datepicker should be in a modal");
});
