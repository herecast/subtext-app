import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';

module('Integration | Component | event form dates schedule recurring form', function(hooks) {
  setupRenderingTest(hooks);

  test('defaults', async function(assert) {
    assert.expect(1);

    this.set('schedule', EmberObject.create());

    await render(hbs`{{component 'event-form-dates/schedule-recurring-form' schedule=schedule}}`);

    assert.equal($(this.element).find('select option:selected').text().trim(), 'Weekly', 'default repeat mode should be weekly');
  });

  test('saving', async function(assert) {
    assert.expect(1);

    this.set('actions', {
      cancel: function() {
        return true;
      },
      validate() {
        return true;
      },
      addNewSchedule: function(schedule, actual) {
        let expected = {
          "daysOfWeek": [],
          "repeats": "weekly",
          "startDate": undefined,
          "startTime": "09:00 am",
          "stopDate": undefined,
          "stopTime": undefined,
          "weeksOfMonth": [],
        };

        assert.deepEqual(actual, expected, 'it should build a representation of a schedule');
      }
    });

    this.set('schedule', EmberObject.create());

    await render(hbs`{{component 'event-form-dates/schedule-recurring-form'
                schedule=schedule
                save=(action 'addNewSchedule')
                validate=(action 'validate')
                cancel=(action 'cancel')}}`);

    const $saveButton = $(this.element).find("button:contains('Done')")[0];
    await click($saveButton);
  });
});
