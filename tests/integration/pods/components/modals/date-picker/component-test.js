import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForComponent('modals/date-picker', 'Integration | Component | modals/date picker', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  const model = { enabledDays: [], selectedDay: 'some day'};
  this.set('model', model );
  this.render(hbs`
    {{modals/date-picker
      model=model
    }}
  `);

  const $modalDialog = this.$(testSelector('modal', 'datepicker'));

  assert.ok($modalDialog.length === 1, "datepicker should be in a modal");
});
