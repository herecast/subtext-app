import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import moment from 'moment';

moduleForComponent('event-other-dates', 'Integration | Component | event other dates', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{event-other-dates}}`);

  assert.equal(this.$().text().trim(), '');
});

test('it shows future event dates', function(assert) {

  const instance1 = Ember.Object.create({
    startsAt: moment().add(1, 'days'),
    id: 1,
    subtitle: 'The next time'
  });

  const instance2 = Ember.Object.create({
    startsAt: moment().add(2, 'days'),
    id: 2,
    subtitle: 'The next, next time'
  });

  this.set('eventinst', Ember.Object.create({
    startsAt: moment(),
    futureInstances: [
      instance1,
      instance2
    ]
  }));

  this.render(hbs`{{event-other-dates event=eventinst}}`);

  assert.equal(this.$('.FutureEvent').length, 2);
});

