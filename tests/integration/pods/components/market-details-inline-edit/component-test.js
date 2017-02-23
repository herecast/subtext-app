import Ember from 'ember';
import { moduleForComponent, test, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('market-details-inline-edit', 'Integration | Component | market details inline edit', {
  integration: true
});

test('title', function(assert) {

  const market = Ember.Object.create({
    title: 'A fine market title'
  });
  this.set('market', market);

  this.render(hbs`{{market-details-inline-edit model=market}}`);

  const $title = this.$('[data-test-component="market-title"]');
  assert.ok(
    $title.text().indexOf( market.get('title') ) > -1,
    "Displays title"
  );

  $title.find('[data-test-action="toggle-edit"]').click();

  $title.find('input').val('Title 2').trigger('change');

  assert.equal(market.get('title'), 'Title 2',
    "editing title field persists to model"
  );

});

test('description-display', function(assert) {
  const market = Ember.Object.create({
    content: '<b>A fine market description</b>'
  });
  this.set('market', market);

  this.render(hbs`{{market-details-inline-edit model=market}}`);

  const $desc = this.$('[data-test-component="market-content"]');
  assert.ok(
    $desc.html().indexOf( market.get('content') ) > -1,
    "Displays content"
  );

});
// Can't test summernote
skip('description-editing');

test('image', function(assert) {
  assert.expect(4);

  const market = Ember.Object.create({
    images: [
      {imageUrl: 'http://test.it/1.jpg'},
      {imageUrl: 'http://test.it/2.jpg'},
      {imageUrl: 'http://test.it/3.jpg'}
    ]
  });
  this.set('market', market);

  this.render(hbs`{{market-details-inline-edit model=market}}`);

  const $imgComponent = this.$('[data-test-component="image-upload-tiles"]');

  assert.equal(
    $imgComponent.length, 1,
    "embeds image-upload-tiles component"
  );

  market.get('images').forEach((img, index) => {
    assert.ok(
      $imgComponent.find(`img[src="${img.imageUrl}"]`).length > 0,
      `image ${index +1} is properly bound`
    );
  });
});

test('price', function(assert) {

  const market = Ember.Object.create({
    price: 'Free to good home'
  });
  this.set('market', market);

  this.render(hbs`{{market-details-inline-edit model=market}}`);

  const $price = this.$('[data-test-component="market-price"]');
  assert.ok(
    $price.text().indexOf( market.get('price') ) > -1,
    "Displays price"
  );

  $price.find('[data-test-action="toggle-edit"]').click();

  $price.find('input').val('$75').trigger('change');

  assert.equal(market.get('price'), '$75',
    "editing price field persists to model"
  );

});

test('email', function(assert) {

  const market = Ember.Object.create({
    contactEmail: 'curiousgeorge@monkey.com'
  });
  this.set('market', market);

  this.render(hbs`{{market-details-inline-edit model=market}}`);

  const $email = this.$('[data-test-component="market-contact-email"]');
  assert.ok(
    $email.text().indexOf( market.get('contactEmail') ) > -1,
    "Displays contactEmail"
  );

  $email.find('[data-test-action="toggle-edit"]').click();

  $email.find('input').val('YellowHat@man.com').trigger('change');

  assert.equal(market.get('contactEmail'), 'YellowHat@man.com',
    "editing contactEmail field persists to model"
  );

});

test('phone', function(assert) {
  const market = Ember.Object.create({
    contactPhone: '555-555-5555'
  });

  this.set('market', market);

  this.render(hbs`{{market-details-inline-edit model=market}}`);

  const $phone = this.$('[data-test-component="market-contact-phone"]');
  assert.ok(
    $phone.text().indexOf( market.get('contactPhone') ) > -1,
    "Displays contactPhone"
  );

  $phone.find('[data-test-action="toggle-edit"]').click();

  $phone.find('input').val('555-555-0000').trigger('change');

  assert.equal(market.get('contactPhone'), '555-555-0000',
    "editing contactPhone field persists to model"
  );

});
