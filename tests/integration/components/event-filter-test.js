import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('event-filter', 'Integration | Component | event filter', {
  integration: true
});

test('initializing', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
  this.setProperties({
    category: 'Everything',
    query: null,
    startDate: '2015-12-22',
    stopDate: '2015-12-28',
    location: 'All Comunities'
  });

  this.render(hbs`{{event-filter
    category=category
    query=query
    startDate=startDate
    stopDate=stopDate
    location=location
    updateFilter='updateFilter'
  }}`);

  const $everythingInput = this.$('.FilterBar-form .FilterBar-categoryFilter input');

  assert.equal($everythingInput.val(), 'Everything', 'it should have "Everything" as the default value');

  this.set('category', 'Movies');

  assert.equal($everythingInput.val(), 'Movies', 'it should display "Movies" within the input field');
});
