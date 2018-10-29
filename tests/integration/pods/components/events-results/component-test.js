import sinon from 'sinon';
import EmberObject from '@ember/object';

import { A } from '@ember/array';
import Service from '@ember/service';
import RSVP from 'rsvp';
import moment from 'moment';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | events results', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:user-location', Service.extend({
      on(){},
      off(){}
    }));
    this.owner.register('service:feature-flags', Service.extend({}));
  });

  test('it renders', async function(assert) {
    await render(hbs`{{events-results}}`);

    assert.ok(1);
  });

  test('clicking the date header calendar button, gtm event', async function(assert) {
    const events = A([
      EmberObject.create({
        contentType: 'event',
        startsAt: moment(),
        startsAtUnix: moment().unix(),
        title: "must see event"
      })
    ]);

    const session = {
      incrementEventSequence() {
        return RSVP.resolve(1);
      }
    };

    const tracking = {
      push: sinon.spy()
    };

    const enabledEventDays = [];

    const updateEnabledEventDays = function() {
      return RSVP.resolve();
    };

    this.setProperties({events, session, tracking, enabledEventDays, updateEnabledEventDays});

    await render(hbs`
      {{events-results events=events session=session tracking=tracking
        enabledEventDays=enabledEventDays
        updateEnabledEventDays=updateEnabledEventDays
      }}
    `);

    await click('[data-test-component=events-by-day] [data-test-action=open-calendar]');

    assert.deepEqual(tracking.push.getCall(0).args[0], {
        event: 'events-clicked-calendar-icon',
        context: 'date-header',
        url: window.location.href,
        'event-sequence': 1,
        event_day: moment().format('YYYY-MM-DD')
      },
      "triggers GTM event events-clicked-calendar-icon, scoped to date header");
  });

  test('clicking the floating calendar button, gtm event', async function(assert) {
    const events = A([
      EmberObject.create({
        contentType: 'event',
        startsAt: moment(),
        startsAtUnix: moment().unix(),
        title: "must see event"
      })
    ]);

    const session = {
      incrementEventSequence() {
        return RSVP.resolve(1);
      }
    };

    const tracking = {
      push: sinon.spy()
    };

    const enabledEventDays = [];

    const updateEnabledEventDays = function() {
      return RSVP.resolve();
    };

    this.setProperties({events, session, tracking, enabledEventDays, updateEnabledEventDays});

    await render(hbs`
      {{events-results events=events session=session tracking=tracking
        enabledEventDays=enabledEventDays
        updateEnabledEventDays=updateEnabledEventDays
      }}
    `);

    await click('.EventsResults-floatingActions [data-test-action=open-calendar]');

    assert.deepEqual(tracking.push.getCall(0).args[0], {
        event: 'events-clicked-calendar-icon',
        context: 'floating-calendar-button',
        url: window.location.href,
        'event-sequence': 1,
        event_day: moment().format('YYYY-MM-DD')
      },
      "triggers GTM event events-clicked-calendar-icon, scoped to floating button");
  });

  test('clicking the prev day button, gtm event', async function(assert) {
    const startDate='2017-12-25';

    const events = A([
      EmberObject.create({
        contentType: 'event',
        startsAt: moment(startDate),
        startsAtUnix: moment(startDate).unix(),
        title: "must see event"
      })
    ]);

    const session = {
      incrementEventSequence() {
        return RSVP.resolve(1);
      }
    };

    const tracking = {
      push: sinon.spy()
    };

    const enabledEventDays = [
      {date: '2017-12-23', count: 1},
      {date: '2017-12-25', count: 777}
    ];

    const updateEnabledEventDays = function() {
      return RSVP.resolve();
    };

    this.setProperties({
      startDate,
      events,
      session,
      tracking,
      enabledEventDays,
      updateEnabledEventDays
    });

    await render(hbs`
      {{events-results events=events session=session tracking=tracking
        startDate=startDate
        enabledEventDays=enabledEventDays
        updateEnabledEventDays=updateEnabledEventDays
      }}
    `);

    await click('[data-test-action=previous-day]');

    assert.deepEqual(tracking.push.getCall(0).args[0], {
        event: 'events-clicked-prev-day',
        context: '2017-12-23',
        url: window.location.href,
        'event-sequence': 1,
        event_day: '2017-12-25'
      },
      "triggers GTM event events-clicked-prev-day, with previous enabled day");
  });

  test('clicking the next day button, gtm event', async function(assert) {
    const startDate='2017-12-23';

    const events = A([
      EmberObject.create({
        contentType: 'event',
        startsAt: moment(startDate),
        startsAtUnix: moment(startDate).unix(),
        title: "must see event"
      })
    ]);

    const session = {
      incrementEventSequence() {
        return RSVP.resolve(1);
      }
    };

    const tracking = {
      push: sinon.spy()
    };

    const enabledEventDays = [
      {date: '2017-12-23', count: 1},
      {date: '2017-12-25', count: 777}
    ];

    const updateEnabledEventDays = function() {
      return RSVP.resolve();
    };

    this.setProperties({
      startDate,
      events,
      session,
      tracking,
      enabledEventDays,
      updateEnabledEventDays
    });

    await render(hbs`
      {{events-results events=events session=session tracking=tracking
        startDate=startDate
        enabledEventDays=enabledEventDays
        updateEnabledEventDays=updateEnabledEventDays
      }}
    `);

    await click('[data-test-action=next-day]');

    assert.deepEqual(tracking.push.getCall(0).args[0], {
        event: 'events-clicked-next-day',
        context: '2017-12-25',
        url: window.location.href,
        'event-sequence': 1,
        event_day: '2017-12-23'
      },
      "triggers GTM event events-clicked-next-day, with next enabled day");
  });
});
