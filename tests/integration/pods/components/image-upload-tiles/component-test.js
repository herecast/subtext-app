/* global Blob */

import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';

const {RSVP, RSVP: { Promise }} = Ember;

function createImageFixture(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg');
  });
}

moduleForComponent('image-upload-tiles', 'Integration | Component | image upload tiles', {
  integration: true
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
});

test('selecting one image', function(assert) {
  assert.expect(1);
  const done = assert.async();

  function addImage(img) {
    assert.equal(img.constructor.modelName, "image",
      'It calls imageAdded action with an image instance when an image is uploaded'
    );

    done();
  }

  this.set('imageAdded', addImage);

  this.render(hbs`{{image-upload-tiles imageAdded=(action imageAdded)}}`);

  createImageFixture(200,200).then((file)=> {
    this.$('.ImageUploadTiles-fileInput').triggerHandler({
      type: 'change',
      target: {
        files: [
          file
        ]
      }
    });
  });
});

test('selecting multiple images', function(assert) {
  assert.expect(3);
  const done = assert.async(3);

  let addImageCount = 0;
  function addImage(img) {
    addImageCount++;

    assert.equal(img.constructor.modelName, "image",
      'It calls imageAdded action with an image;  count: ' + addImageCount
    );

    done();
  }

  this.set('imageAdded', addImage);

  this.render(hbs`{{image-upload-tiles imageAdded=(action imageAdded)}}`);

  RSVP.all([
    createImageFixture(200,200),
    createImageFixture(200,200),
    createImageFixture(200,200)
  ]).then((files)=> {
    this.$('.ImageUploadTiles-fileInput').triggerHandler({
      type: 'change',
      target: {
        files: files
      }
    });
  });
});

test('selecting an image smaller than minimum size', function(assert) {
  assert.expect(1);

  this.render(hbs`{{image-upload-tiles }}`);

  return createImageFixture(100,100).then((file)=> {
    this.$('.ImageUploadTiles-fileInput').triggerHandler({
      type: 'change',
      target: {
        files: [
          file
        ]
      }
    });

    return wait().then(()=> {
      assert.equal(
        this.$('.ImageUploadTiles-error').text().trim(),
        "Image must have minimum dimensions of 200x200",
        'it displays minimum size validation error'
      );
    });
  });
});

test('selecting an file is not an image', function(assert) {
  assert.expect(1);

  this.render(hbs`{{image-upload-tiles }}`);

  const file = new Blob([], {type: 'text/html'});

  this.$('.ImageUploadTiles-fileInput').triggerHandler({
    type: 'change',
    target: {
      files: [
        file
      ]
    }
  });

  return wait().then(()=> {
    assert.equal(
      this.$('.ImageUploadTiles-error').text().trim(),
      "File must be an image",
      'it displays file type validation error'
    );
  });
});

test('clicking button to remove image', function(assert) {
  assert.expect(1);

  const images = [
    Ember.Object.create({imageUrl: 'http://test.image/1'}),
    Ember.Object.create({imageUrl: 'http://test.image/2'}),
    Ember.Object.create({imageUrl: 'http://test.image/3'})
  ];

  this.setProperties({
    images: images,
    removeImage(i) {
      assert.deepEqual(i, images[1],
        "It raises 'removeImage' action with correct image as argument"
      );
    }
  });

  this.render(hbs`{{image-upload-tiles images=images removeImage=(action removeImage)}}`);

  const $tile = this.$('.ImageUploadTiles-imageTile').eq(1);

  $tile.find('[data-test-action="remove-image"]').click();
});

test('clicking button to set image as primary', function(assert) {
  assert.expect(1);

  const images = [
    Ember.Object.create({imageUrl: 'http://test.image/1'}),
    Ember.Object.create({imageUrl: 'http://test.image/2'}),
    Ember.Object.create({imageUrl: 'http://test.image/3'})
  ];

  this.setProperties({
    images: images,
    setPrimary(i) {
      assert.deepEqual(i, images[1],
        "It raises 'setPrimary' action with correct image as argument"
      );
    }
  });

  this.render(hbs`{{image-upload-tiles images=images setPrimary=(action setPrimary)}}`);

  const $tile = this.$('.ImageUploadTiles-imageTile').eq(1);

  $tile.find('[data-test-action="set-primary"]').click();
});

test('images marked as _delete', function(assert) {
  const images = [
    Ember.Object.create({imageUrl: 'http://test.image/1'}),
    Ember.Object.create({_delete: true, imageUrl: 'http://test.image/2'})
  ];


  this.set('images', images);

  this.render(hbs`{{image-upload-tiles images=images}}`);

  assert.equal(this.$('.ImageUploadTiles-imageTile').length, 1, "It does not show images with '_delete' true");
});

test('images marked as primary', function(assert) {
  const images = [
    Ember.Object.create({imageUrl: 'http://test.image/1'}),
    Ember.Object.create({primary: true, imageUrl: 'http://test.image/2'})
  ];


  this.set('images', images);

  this.render(hbs`{{image-upload-tiles images=images}}`);

  const $primaryTile = this.$('.ImageUploadTiles-imageTile').eq(1);

  assert.ok(
    $primaryTile.hasClass('ImageUploadTiles-primary'),
    "It adds a class to flag primary image tile"
  );

  assert.equal(
    $primaryTile.find(['data-test-action="set-primary"']).length,
    0,
    "It hides the action to set as primary for primary image tile"
  );
});
