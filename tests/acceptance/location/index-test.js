import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | location/index', {
  beforeEach() {
    this.location = server.create('location');
  }
});

test('visiting index shows feed', function(assert) {
  const locationId = this.location.id;

  server.createList('feed-content', 100);

  const url = `/${locationId}/`;
  visit(url);

  andThen(function() {
    assert.equal(currentURL(), `/${locationId}/`, 'should be on index page');
    assert.equal(find(testSelector('feed-card')).length, 20, 'should show first 20 content items');

      click(find(testSelector('see-more-content')));
      andThen(function() {
        assert.equal(find(testSelector('see-more-content')).length, 0, 'should remove the see more content button after click');
      });
  });
});
