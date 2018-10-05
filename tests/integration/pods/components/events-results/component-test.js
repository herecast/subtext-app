/* global sinon */
import Ember from 'ember';
import moment from 'moment';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const {
  RSVP
} = Ember;

moduleForComponent('events-results', 'Integration | Component | events results', {
  integration: true,
  beforeEach() {
    this.register('service:user-location', Ember.Service.extend({
      on(){},
      off(){}
    }));
    this.register('service:feature-flags', Ember.Service.extend({}));
  }
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{events-results}}`);

  assert.ok(1);


});

test('clicking the date header calendar button, gtm event', function(assert) {
  const events = Ember.A([
    Ember.Object.create({
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

  this.render(hbs`
    {{events-results events=events session=session tracking=tracking
      enabledEventDays=enabledEventDays
      updateEnabledEventDays=updateEnabledEventDays
    }}
  `);

  this.$('[data-test-component=events-by-day] [data-test-action=open-calendar]').trigger('click');

  assert.deepEqual(tracking.push.getCall(0).args[0], {
      event: 'events-clicked-calendar-icon',
      context: 'date-header',
      url: window.location.href,
      'event-sequence': 1,
      event_day: moment().format('YYYY-MM-DD')
    },
    "triggers GTM event events-clicked-calendar-icon, scoped to date header");
});

test('clicking the floating calendar button, gtm event', function(assert) {
  const events = Ember.A([
    Ember.Object.create({
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

  this.render(hbs`
    {{events-results events=events session=session tracking=tracking
      enabledEventDays=enabledEventDays
      updateEnabledEventDays=updateEnabledEventDays
    }}
  `);

  this.$('.EventsResults-floatingActions [data-test-action=open-calendar]').trigger('click');

  assert.deepEqual(tracking.push.getCall(0).args[0], {
      event: 'events-clicked-calendar-icon',
      context: 'floating-calendar-button',
      url: window.location.href,
      'event-sequence': 1,
      event_day: moment().format('YYYY-MM-DD')
    },
    "triggers GTM event events-clicked-calendar-icon, scoped to floating button");
});

test('clicking the prev day button, gtm event', function(assert) {
  const startDate='2017-12-25';

  const events = Ember.A([
    Ember.Object.create({
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

  this.render(hbs`
    {{events-results events=events session=session tracking=tracking
      startDate=startDate
      enabledEventDays=enabledEventDays
      updateEnabledEventDays=updateEnabledEventDays
    }}
  `);

  this.$('[data-test-action=previous-day]').trigger('click');

  assert.deepEqual(tracking.push.getCall(0).args[0], {
      event: 'events-clicked-prev-day',
      context: '2017-12-23',
      url: window.location.href,
      'event-sequence': 1,
      event_day: '2017-12-25'
    },
    "triggers GTM event events-clicked-prev-day, with previous enabled day");
});

test('clicking the next day button, gtm event', function(assert) {
  const startDate='2017-12-23';

  const events = Ember.A([
    Ember.Object.create({
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

  this.render(hbs`
    {{events-results events=events session=session tracking=tracking
      startDate=startDate
      enabledEventDays=enabledEventDays
      updateEnabledEventDays=updateEnabledEventDays
    }}
  `);

  this.$('[data-test-action=next-day]').trigger('click');

  assert.deepEqual(tracking.push.getCall(0).args[0], {
      event: 'events-clicked-next-day',
      context: '2017-12-25',
      url: window.location.href,
      'event-sequence': 1,
      event_day: '2017-12-23'
    },
    "triggers GTM event events-clicked-next-day, with next enabled day");
});
