import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'ember-test-selectors';
import mockLocationCookie from 'subtext-ui/tests/helpers/mock-location-cookie';


moduleForAcceptance('Acceptance | reset to preferred location', {
  beforeEach() {
    this.myLocation = mockLocationCookie(this.application);
  }
});

test('visiting /feed for location other than my preferred', function(assert) {
  const otherLocation = server.create('location');

  visit(`/feed?location=${otherLocation.id}`);

  andThen(()=>{
    const $mismatchPrompt = find(testSelector('component', 'location-mismatch-prompt'));

    assert.equal(
      $mismatchPrompt.length,
      1,
      "Displays prompt about preferred location not matching current"
    );

    click(
      testSelector('action', 'reset-location'),
      $mismatchPrompt
    );
  });

  andThen(()=>{
    assert.equal(
      currentURL(),
      `/feed?location=${this.myLocation.id}`,
      "Clicking the change location buttons takes me to my preferred location version of this page"
    );
  });
});

test('visiting location.events for location other than my preferred', function(assert) {
  const otherLocation = server.create('location');

  visit(`/${otherLocation.id}/events`);

  andThen(()=>{
    const $mismatchPrompt = find(testSelector('component', 'location-mismatch-prompt'));

    assert.equal(
      $mismatchPrompt.length,
      1,
      "Displays prompt about preferred location not matching current"
    );

    click(
      testSelector('action', 'reset-location'),
      $mismatchPrompt
    );
  });

  andThen(()=>{
    assert.equal(
      currentURL(),
      `/${this.myLocation.id}/events`,
      "Clicking the change location buttons takes me to my preferred location version of this page"
    );
  });
});
