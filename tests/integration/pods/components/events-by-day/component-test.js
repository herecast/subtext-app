import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | events by day', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(1);

    this.set('day', 'Today, day of some Month');
    this.set('events', []);
    this.set('selectDay', 'Another Day');
    this.set('enabledDays', []);

    await render(hbs`{{events-by-day
            day=day
            events=events
            selectDay=selectDay
            enabledDays=enabledDays
    }}`);

    assert.equal(this.element.textContent.trim(), 'Today, day of some Month');

  });
});
