import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

const { set } = Ember;

moduleForComponent('pikaday-solo', 'Integration | Component | pikaday solo', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  set(this, 'externalAction', (date) => {
    // This does not work. Perhaps there is something going on with the underlying
    // pikaday library that prevents us from clicking individual days in the calendar.
    // Leaving this here in case we ever figure out what the issue is but as of now
    // we are not able to test user interaction with the calendar
    assert.equal(date, 'does not matter. this never gets called');
  });

  this.render(hbs`
    {{pikaday-solo
      updateSelected=(action externalAction)
    }}`);

  const $pickadaySolo = this.$(testSelector('component', 'pickadaySolo'));
  const $dateButton = $pickadaySolo.find('td[data-day="4"] button')[0];

  assert.ok($pickadaySolo.length === 1, "");

  // verified this is the correct DOM element.
  // it cannot be clicked however
  $dateButton.click();
});
