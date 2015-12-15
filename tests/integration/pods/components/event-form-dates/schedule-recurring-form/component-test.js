import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('event-form-dates/schedule-recurring-form', 'Integration | Component | event form dates schedule recurring form', {
  integration: true
});

test('defaults', function(assert) {
  assert.expect(1);

  this.set('schedule', Ember.Object.create());

  this.render(hbs`{{component 'event-form-dates/schedule-recurring-form' schedule=schedule}}`);

  assert.equal(this.$('select option:selected').text().trim(), 'Weekly', 'default repeat mode should be weekly');
});

test('saving', function(assert) {
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
        "presenterName": undefined,
        "repeats": "weekly",
        "startDate": undefined,
        "startTime": "09:00 am",
        "stopDate": undefined,
        "stopTime": undefined,
        "subtitle": undefined,
        "weeksOfMonth": [],
      };

      assert.deepEqual(actual, expected, 'it should build a representation of a schedule');
    }
  });

  this.set('schedule', Ember.Object.create());

  this.render(hbs`{{component 'event-form-dates/schedule-recurring-form'
              schedule=schedule
              save=(action 'addNewSchedule')
              validate=(action 'validate')
              cancel=(action 'cancel')}}`);

  const $saveButton = this.$("button:contains('Done')");
  $saveButton.click();
});
