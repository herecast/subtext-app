/**
 * SKIPPED BECAUSE OF ISSUES WITH THE EXIF LIBRARY
 */

/*
import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';
import createImageFixture from 'subtext-ui/tests/helpers/create-image-fixture';

const {RSVP} = Ember;


moduleForComponent('image-upload-tiles', 'Integration | Component | image upload tiles', {
  integration: true
});

test('it renders with no images', function(assert) {
  this.set('images', []);

  this.render(hbs`{{image-upload-tiles images=images}}`);

  assert.equal(
    this.$('.ImageInputTile').length, 1,
    "Displays tile for adding an image"
  );

  assert.equal(
    this.$('[data-test-message="reminder-to-add-images"]').length, 1,
    "Displays help text reminder to add images"
  );
});
test('it renders given images', function(assert) {
  const images = [
    Ember.Object.create({imageUrl: 'http://test.image/1'}),
    Ember.Object.create({imageUrl: 'http://test.image/2'}),
    Ember.Object.create({imageUrl: 'http://test.image/3'})
  ];

  this.set('images', images);

  this.render(hbs`{{image-upload-tiles images=images}}`);

  images.forEach((img, index) => {
    let $imageEl = this.$(`img[src="${img.get('imageUrl')}"]`);
    assert.ok($imageEl.length > 0,
      `It renders an img tag for image ${index +1}`
    );
  });

  assert.equal(
    this.$('[data-test-message="reminder-to-add-images"]').length, 0,
    "It does not display reminder when images are present"
  );
});

test('6 images present', function(assert) {
  const images = [
    Ember.Object.create({imageUrl: 'http://test.image/1'}),
    Ember.Object.create({imageUrl: 'http://test.image/2'}),
    Ember.Object.create({imageUrl: 'http://test.image/3'}),
    Ember.Object.create({imageUrl: 'http://test.image/4'}),
    Ember.Object.create({imageUrl: 'http://test.image/5'}),
    Ember.Object.create({imageUrl: 'http://test.image/6'})
  ];

  this.set('images', images);

  this.render(hbs`{{image-upload-tiles images=images}}`);

  assert.equal(
    this.$('.ImageInputTile').length, 0,
    "It does not display tile for adding an image"
  );
});

test('selecting one image', function(assert) {
  assert.expect(2);
  const done = assert.async();

  const model = {
    images: Ember.A([])
  };

  this.set('model', model);

  this.render(hbs`{{image-upload-tiles images=model.images}}`);

  return createImageFixture(200,200).then((file)=> {
    const $fileInput = this.$('.ImageUploadTiles input[type=file]');

    $fileInput.triggerHandler({
      type: 'change',
      target: {
        files: [
          file
        ]
      }
    });

    return wait().then(() => {
      assert.equal(model.images.length, 1,
        "It adds the the new image to the model"
      );

      assert.equal(
        this.$('.ImageTile img[src^="data:image"]').length, 1,
        "Adds a new image tile"
      );

      done();
    });
  });
});

test('selecting multiple images', function(assert) {
  assert.expect(2);
  const done = assert.async();

  const model = {
    images: Ember.A([])
  };

  this.set('model', model);

  this.render(hbs`{{image-upload-tiles images=model.images}}`);

  return RSVP.all([
    createImageFixture(200,200),
    createImageFixture(200,200),
    createImageFixture(200,200)
  ]).then((files)=> {
    const $fileInput = this.$('.ImageUploadTiles input[type=file]');

    $fileInput.triggerHandler({
      type: 'change',
      target: {
        files: files
      }
    });

    return wait().then(() => {
      assert.equal(model.images.length, 3,
        "It adds the the new image to the model for each file selected"
      );

      assert.equal(
        this.$('.ImageTile img[src^="data:image"]').length, 3,
        "Adds a new image tile for each image selected"
      );

      done();
    });
  });
});

test('clicking button to remove image', function(assert) {
  assert.expect(2);

  const images = [
    Ember.Object.create({imageUrl: 'http://test.image/1'}),
    Ember.Object.create({imageUrl: 'http://test.image/2'}),
    Ember.Object.create({imageUrl: 'http://test.image/3'})
  ];

  this.setProperties({
    images: images
  });

  this.render(hbs`{{image-upload-tiles images=images}}`);

  const $tile = this.$('.ImageUploadTiles-tile').eq(1);

  $tile.find('[data-test-action="remove-image"]').click();

  return wait().then(()=> {
    assert.ok(
      images[1].get('_delete'),
      "The image is marked for deletion"
    );

    assert.equal(
      this.$('.ImageUploadTiles-tile:not(.ImageInputTile)').length,
      2,
      "The image marked for deletion is not displayed"
    );
  });
});

test('clicking button to set image as primary', function(assert) {
  assert.expect(2);

  const images = [
    Ember.Object.create({primary: true, imageUrl: 'http://test.image/1'}),
    Ember.Object.create({imageUrl: 'http://test.image/2'}),
    Ember.Object.create({imageUrl: 'http://test.image/3'})
  ];

  this.setProperties({
    images: images
  });

  this.render(hbs`{{image-upload-tiles images=images}}`);

  const $tile = this.$('.ImageUploadTiles-tile').eq(1);

  $tile.find('[data-test-action="set-primary"]').click();

  return wait().then(()=>{
    assert.ok(
      images[1].get('primary'),
      'Image marked primary on model'
    );

    assert.notOk(
      images[0].get('primary'),
      "Previous primary image is unmarked"
    );
  });
});
*/
