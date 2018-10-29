import { set } from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | pikaday solo', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(2);

    set(this, 'externalAction', (date) => {
      // This does not work. Perhaps there is something going on with the underlying
      // pikaday library that prevents us from clicking individual days in the calendar.
      // Leaving this here in case we ever figure out what the issue is but as of now
      // we are not able to test user interaction with the calendar
      assert.ok(date);
    });

    await render(hbs`
      {{pikaday-solo
        updateSelected=(action externalAction)
      }}`);

    const $pickadaySolo = this.element.querySelector('[data-test-component="pickadaySolo"]');
    const $dateButton = $pickadaySolo.querySelector('td[data-day="4"] button');

    assert.ok($pickadaySolo);

    // verified this is the correct DOM element.
    // it cannot be clicked however
    await click($dateButton);
  });
});
