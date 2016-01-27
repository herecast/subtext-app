import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';

// TODO: move this into a helper
/* jshint ignore:start */
  import { currentSession, authenticateSession, invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
/* jshint ignore:end */

moduleForAcceptance('Acceptance | events');

test('visiting /events', function(assert) {
  visit('/events');

  andThen(function() {
    assert.equal(currentURL(), '/events');
  });
});
