import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | modals/date picker', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(1);

    const model = { enabledDays: [], selectedDay: 'some day'};
    this.set('model', model );
    await render(hbs`
      {{modals/date-picker
        model=model
      }}
    `);

    const $modalDialog = this.element.querySelector('[data-test-modal="datepicker"]');

    assert.ok($modalDialog, "datepicker should be in a modal");
  });
});
