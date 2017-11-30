import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('events-by-day', 'Integration | Component | events by day', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  this.set('day', 'Today, day of some Month');
  this.set('events', []);
  this.set('selectDay', 'Another Day');
  this.set('enabledDays', []);

  this.render(hbs`{{events-by-day
          day=day
          events=events
          selectDay=selectDay
          enabledDays=enabledDays
  }}`);

  assert.equal(this.$().text().trim(), 'Today, day of some Month');

});
