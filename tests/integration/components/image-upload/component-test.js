import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const imageUrl = 'data:image/gif;base64,R0lGOD lhCwAOAMQfAP////7+/vj4+Hh4eHd3d/v7+/Dw8HV1dfLy8ubm5vX19e3t7fr 6+nl5edra2nZ2dnx8fMHBwYODg/b29np6eujo6JGRkeHh4eTk5LCwsN3d3dfX 13Jycp2dnevr6////yH5BAEAAB8ALAAAAAALAA4AAAVq4NFw1DNAX/o9imAsB tKpxKRd1+YEWUoIiUoiEWEAApIDMLGoRCyWiKThenkwDgeGMiggDLEXQkDoTh CKNLpQDgjeAsY7MHgECgx8YR8oHwNHfwADBACGh4EDA4iGAYAEBAcQIg0Dk gcEIQA7';

moduleForComponent('image-upload', 'Integration | Component | image upload', {
  integration: true,

  beforeEach: () => { },
  afterEach: () => { }
});

test('the primary image is visually distinct', function(assert) {
  assert.expect(2);

  const image = {
    imageUrl: imageUrl,
    primary: 1
  };

  this.set('image', image);

  this.render(hbs`
    {{image-upload
      image=image
     }}
  `);

  const $ImageUpload = $('.ImageUpload');

  assert.ok($ImageUpload.hasClass('is-primary'), 'image-upload with primary image should have modifying class');

  this.set('image.primary', 0);

  assert.ok(!$ImageUpload.hasClass('is-primary'), 'image-upload without primary image should not have modifying class');
});

test('without existing image data url, the file input is present', function(assert) {
  this.set('image', {primary: 1});

  this.render(hbs`
    {{image-upload
      image=image
    }}
  `);

  const $input = $('.ImageUpload input[type=file]');

  assert.ok($input.length, 'Expected to find file input element');
});

test('Removing an image sends image to the remove image action', function(assert) {
  assert.expect(1);

  const image = {primary: 1};
  this.set('image', image);

  this.set('actions', {
    removeImage: function(removedImage) {
      assert.equal(removedImage, image, 'Removed image should be the image that is set on the component');
    }
  });

  this.render(hbs`
    {{image-upload
      image=image
      remove=(action 'removeImage')
    }}
  `);

  const $removeButton = $('.ImageUpload-remove');

  $removeButton.click();
});

test('Open the image cropper', function(assert) {
  assert.expect(1);

  let modalDialogService = this.container.lookup('service:modal-dialog');
  modalDialogService.destinationElementId = 'modal-overlays';

  const image = {
    imageUrl: imageUrl,
    primary: 1,
    isNew: true
  };

  this.set('image', image);

  this.render(hbs`
    <div id='modal-overlays'></div>
    {{image-upload
      image=image
    }}
  `);

  const $showCropper = $('.ImageUpload-showCropper');

  $showCropper.click();

  const $cropper = $('.ImageCropper');

  assert.ok($cropper.length, 'Image cropper was not opened');
});

test('The image cropper is not available for existing images', function(assert) {
  assert.expect(1);

  const image = {
    imageUrl: imageUrl,
    primary: 1,
    isNew: false
  };

  this.set('image', image);

  this.render(hbs`
    <div id='modal-overlays'></div>
    {{image-upload
      image=image
    }}
  `);

  const $showCropper = $('.ImageUpload-showCropper');

  assert.ok(!$showCropper.length, 'Image cropper should not be available');
});

test('The original image name is used for new images', function(assert) {
  assert.expect(1);

  const image = {
    imageUrl: imageUrl,
    primary: 1,
    isNew: true,
    originalImageFile: {name: 'bears.jpg'}
  };

  this.set('image', image);

  this.render(hbs`
    {{image-upload
      image=image
    }}
  `);

  const filename = $('.Image-Upload-previewFilename').text().trim();

  assert.equal(filename, 'bears.jpg');
});

test('The file URL is used for existing images', function(assert) {
  assert.expect(1);

  const image = {
    imageUrl: 'http://www.stuff.com/things/bees.png',
    primary: 1,
    isNew: false
  };

  this.set('image', image);

  this.render(hbs`
    {{image-upload
      image=image
    }}
  `);

  const filename = $('.Image-Upload-previewFilename').text().trim();

  assert.equal(filename, 'bees.png');
});

test('Set image as primary', function(assert) {
  assert.expect(1);

  const image = {
    imageUrl: imageUrl,
    primary: 0
  };

  this.set('image', image);

  this.set('actions', {
    setPrimary: function(primaryImage) {
      assert.equal(primaryImage, image);
    }
  });

  this.render(hbs`
    {{image-upload
      image=image
      setPrimary=(action 'setPrimary')
    }}
  `);

  const $setPrimary = $('.ImageUpload-setPrimary');

  $setPrimary.click();
});
