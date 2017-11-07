import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';


moduleForAcceptance('Acceptance | feed', {
  beforeEach() {
    invalidateSession(this.application);
    window.Intercom = function() {};
  }
});

/** Feed Page **/
test('visiting /feed no location previously selected', function(assert) {
  visit('/feed');

  andThen(function() {
    assert.equal(currentURL(), '/feed?location=sharon-vt',
      "sharon-vt is pre-selected for you"
    );
  });
});

