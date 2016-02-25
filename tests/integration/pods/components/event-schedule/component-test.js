import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('event-schedule', 'Integration | Component | event schedule', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
  this.set('schedule', Ember.Object.create({
    dates: []
  }));

  this.render(hbs`{{event-schedule schedule=schedule}}`);

  assert.ok(this.$('.fc').length === 1, 'should render calendar');
});
