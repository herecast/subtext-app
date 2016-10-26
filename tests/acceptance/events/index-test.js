import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | events/index');

test('visiting /events/', function(assert) {
  server.createList('event-instance', 40);

  visit('/events/');

  andThen(function() {
    assert.equal(currentURL(), '/events/', 'it should be at the events index page');
    assert.ok(find(testSelector('grouped-events-header')), 'it should show the events header');
    assert.equal(find(testSelector('event-card-title')).length, 24, 'it should show one page of events');
    assert.ok(find(testSelector('component', 'content-create-button')), 'it should show the content create button');
    assert.ok(find(testSelector('pagination-next')), 'it should show the pagination next button');
  });

  click(testSelector('pagination-next'));

  andThen(function() {
    assert.ok(find(testSelector('pagination-prev')), 'it should show the pagination prev button');
    assert.ok(find(testSelector('pagination-next')), 'it should show the pagination next button');
    assert.ok(find(testSelector('pagination-first')), 'it should show the pagination first button');

  });
});
