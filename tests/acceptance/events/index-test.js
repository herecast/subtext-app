import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | events/index');

test('visiting /events/', function(assert) {
  assert.expect(2);
  server.createList('event-instance', 10);

  visit('/events/');

  andThen(function() {
    assert.equal(currentURL(), '/events/', 'it should be at the events index page');
    assert.ok(find(testSelector('component', 'content-create-button')), 'it should show the content create button');
  });

});
