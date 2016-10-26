import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | events/show');

test('visiting /events/show', function(assert) {
  const event = server.create('event-instance');
  const url = `/events/${event.id}`;
  visit(url);

  andThen(function() {
    assert.equal(currentURL(), url, 'it should go to the event detail page');
    assert.equal(find(testSelector('event-detail-title')).text(), event.title, 'it should show the title');
    assert.equal(find(testSelector('event-detail-subtitle')).text(), event.subtitle, 'it should show the subtitle');
    assert.equal(find(testSelector('event-detail-presenterName')).text(), event.presenterName, 'it should show the presenterName');
    assert.equal(find(testSelector('event-detail-content')).html().trim(), event.content, 'it should show the content');
    assert.equal(find(testSelector('event-detail-venueAddress')).text(), event.venueAddress, 'it should show the venueAddress');
    assert.equal(find(testSelector('event-detail-venueCity')).text(), event.venueCity, 'it should show the venueCity');
    assert.equal(find(testSelector('event-detail-venueState')).text(), event.venueState, 'it should show the venueState');
    assert.equal(find(testSelector('event-detail-cost')).text(), event.cost, 'it should show the cost');
    assert.equal(find(testSelector('component', event.eventUrl)).attr('href'), event.eventUrl, 'it should show the eventUrl as a link');
    assert.equal(find(testSelector('event-detail-contactEmail')).attr('href'), `mailto:${event.contactEmail}`, 'it should show the contactEmail as a mailto link');
    assert.equal(find(testSelector('event-detail-contactPhone')).text().trim(), event.contactPhone, 'it should show the contactPhone');
    assert.ok(find(testSelector('event-detail-header-image')), 'it should show the header image');
    assert.ok(find(testSelector('event-detail-timeRange')).text(), 'it should show the timeRange');
    assert.ok(find(testSelector('event-detail-registrationDeadline')).text(), 'it should show the registrationDeadline');
    assert.ok(find(testSelector('event-detail-directionsUrl')).attr('href'), 'it should show the directionsUrl link');
    assert.ok(find(testSelector('component', 'report-abuse-link')), 'it should show the Report Abuse link');
    assert.ok(find(testSelector('component', 'event-other-dates')), 'it should show the other events component');
  });

  click(testSelector('link', 'close-event-detail'));

  andThen(function() {
    assert.equal(currentURL(), '/events', 'clicking close button should go to /events/');
  });
});
