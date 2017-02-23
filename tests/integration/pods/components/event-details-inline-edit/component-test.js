import Ember from 'ember';
import wait from 'ember-test-helpers/wait';
import { skip, moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('event-details-inline-edit', 'Integration | Component | event details inline edit', {
  integration: true
});

test('title', function(assert) {

  const event = Ember.Object.create({
    title: 'A fine event title'
  });
  this.set('event', event);

  this.render(hbs`{{event-details-inline-edit model=event}}`);

  const $title = this.$('[data-test-component="event-title"]');
  assert.ok(
    $title.text().indexOf( event.get('title') ) > -1,
    "Displays title"
  );

  $title.find('[data-test-action="toggle-edit"]').click();

  $title.find('input').val('Title 2').trigger('change');

  assert.equal(event.get('title'), 'Title 2',
    "editing title field persists to model"
  );

});

test('description-display', function(assert) {
  const event = Ember.Object.create({
    content: '<b>A fine event description</b>'
  });
  this.set('event', event);

  this.render(hbs`{{event-details-inline-edit model=event}}`);

  const $desc = this.$('[data-test-component="event-content"]');
  assert.ok(
    $desc.html().indexOf( event.get('content') ) > -1,
    "Displays content"
  );

});
// Can't test summernote
skip('description-editing');

test('image', function(assert) {
  const event = Ember.Object.create({
    imageUrl: 'http://test.it/jpg'
  });
  this.set('event', event);

  this.render(hbs`{{event-details-inline-edit model=event}}`);

  const $imgComponent = this.$('[data-test-component="image-upload-tile"]');

  assert.equal(
    $imgComponent.length, 1,
    "embeds image-upload-tile component"
  );

  assert.ok(
    $imgComponent.find(`img[src="${event.get('imageUrl')}"]`).length > 0,
    "image is properly bound"
  );
});

test('venue', function(assert) {

  const event = Ember.Object.create({
    venueId: 1,
    venueName: "The chilln beat"
  });
  this.set('event', event);
  this.render(hbs`{{event-details-inline-edit model=event}}`);

  const $venueCom = this.$('[data-test-component="event-form-venue"]');
  assert.ok($venueCom.length > 0,
    "embeds event-form-venue component"
  );

  assert.ok(
    $venueCom.text().indexOf( event.get('venueName') ) > -1,
    "properly bound to event venue"
  );

});

// Needs work to test dates
skip('dates');

test('Registration info', function(assert) {
  const event = Ember.Object.create({
    formattedRegistrationDeadline: "Yesterday! Too late!"
  });
  this.set('event', event);

  this.render(hbs`{{event-details-inline-edit model=event}}`);

  const $registration = this.$('[data-test-component="event-registration"]');

  assert.ok(
    $registration.text().indexOf( event.get('formattedRegistrationDeadline') ) > -1,
    "Displays event registration info"
  );

  $registration.find('[data-test-action="toggle-edit"]').click();

  return wait().then(()=>{
    assert.ok(
      $registration.find('[data-test-component=event-form-registration]').length > 0,
      "Clicking to toggle edit reveals event-form-registration component"
    );
  });
});

test('Event Cost', function(assert) {
  const event = Ember.Object.create({
    costType: 'free',
    formattedCostType: "Free to all, big or small"
  });
  this.set('event', event);

  this.render(hbs`{{event-details-inline-edit model=event}}`);

  const $cost = this.$('[data-test-component="event-cost"]');

  assert.ok(
    $cost.text().indexOf( event.get('formattedCostType') ) > -1,
    "Displays event cost info"
  );

  $cost.find('[data-test-action="toggle-edit"]').click();

  return wait().then(()=>{
    assert.ok(
      $cost.find('[data-test-component=event-form-cost]').length > 0,
      "Clicking to toggle edit reveals event-form-cost component"
    );
  });
});

test('email', function(assert) {

  const event = Ember.Object.create({
    contactEmail: 'curiousgeorge@monkey.com'
  });
  this.set('event', event);

  this.render(hbs`{{event-details-inline-edit model=event}}`);

  const $email = this.$('[data-test-component="event-contact-email"]');
  assert.ok(
    $email.text().indexOf( event.get('contactEmail') ) > -1,
    "Displays contactEmail"
  );

  $email.find('[data-test-action="toggle-edit"]').click();

  $email.find('input').val('YellowHat@man.com').trigger('change');

  assert.equal(event.get('contactEmail'), 'YellowHat@man.com',
    "editing contactEmail field persists to model"
  );

});

test('phone', function(assert) {
  const event = Ember.Object.create({
    contactPhone: '555-555-5555'
  });

  this.set('event', event);

  this.render(hbs`{{event-details-inline-edit model=event}}`);

  const $phone = this.$('[data-test-component="event-contact-phone"]');
  assert.ok(
    $phone.text().indexOf( event.get('contactPhone') ) > -1,
    "Displays contactPhone"
  );

  $phone.find('[data-test-action="toggle-edit"]').click();

  $phone.find('input').val('555-555-0000').trigger('change');

  assert.equal(event.get('contactPhone'), '555-555-0000',
    "editing contactPhone field persists to model"
  );

});

test('url', function(assert) {
  const event = Ember.Object.create({
    eventUrl: 'http://whitehouse.gov'
  });

  this.set('event', event);

  this.render(hbs`{{event-details-inline-edit model=event}}`);

  const $url = this.$('[data-test-component="event-url"]');
  assert.ok(
    $url.text().indexOf( event.get('eventUrl') ) > -1,
    "Displays eventUrl"
  );

  $url.find('[data-test-action="toggle-edit"]').click();

  $url.find('input').val('http://pentagon.us').trigger('change');

  assert.equal(event.get('eventUrl'), 'http://pentagon.us',
    "editing eventUrl field persists to model"
  );

});
