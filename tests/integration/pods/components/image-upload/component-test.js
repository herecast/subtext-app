import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';

const imageUrl = 'data:image/gif;base64,R0lGOD lhCwAOAMQfAP////7+/vj4+Hh4eHd3d/v7+/Dw8HV1dfLy8ubm5vX19e3t7fr 6+nl5edra2nZ2dnx8fMHBwYODg/b29np6eujo6JGRkeHh4eTk5LCwsN3d3dfX 13Jycp2dnevr6////yH5BAEAAB8ALAAAAAALAA4AAAVq4NFw1DNAX/o9imAsB tKpxKRd1+YEWUoIiUoiEWEAApIDMLGoRCyWiKThenkwDgeGMiggDLEXQkDoTh CKNLpQDgjeAsY7MHgECgx8YR8oHwNHfwADBACGh4EDA4iGAYAEBAcQIg0Dk gcEIQA7';

module('Integration | Component | image upload', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.beforeEach = () => { };
    this.afterEach = () => { };
  });

  test('the primary image is visually distinct', async function(assert) {
    assert.expect(2);

    const image = {
      imageUrl: imageUrl,
      primary: true
    };

    this.set('image', image);

    await render(hbs`
      {{image-upload
        image=image
       }}
    `);

    const $ImageUpload = $(this.element.querySelector('.ImageUpload'));

    assert.ok($ImageUpload.hasClass('is-primary'), 'image-upload with primary image should have modifying class');

    this.set('image.primary', false);

    assert.ok(!$ImageUpload.hasClass('is-primary'), 'image-upload without primary image should not have modifying class');
  });

  test('without existing image data url, the file input is present', async function(assert) {
    this.set('image', {primary: 1});

    await render(hbs`
      {{image-upload
        image=image
      }}
    `);

    const $input = $(this.element).find('.ImageUpload input[type=file]');

    assert.ok($input, 'Expected to find file input element');
  });

  test('Removing an image sends image to the remove image action', async function(assert) {
    assert.expect(1);

    const image = {primary: true};
    this.set('image', image);

    this.set('actions', {
      removeImage: function(removedImage) {
        assert.equal(removedImage, image, 'Removed image should be the image that is set on the component');
      }
    });

    await render(hbs`
      {{image-upload
        image=image
        remove=(action 'removeImage')
      }}
    `);

    const $removeButton = this.element.querySelector('.ImageUpload-remove');

    $removeButton.click();
  });

  test('The original image name is used for new images', async function(assert) {
    assert.expect(1);

    const image = {
      imageUrl: imageUrl,
      primary: true,
      isNew: true,
      originalImageFile: {name: 'bears.jpg'}
    };

    this.set('image', image);

    await render(hbs`
      {{image-upload
        image=image
      }}
    `);

    const filename = this.element.querySelector('.Image-Upload-previewFilename').textContent.trim();

    assert.equal(filename, 'bears.jpg');
  });

  test('The file URL is used for existing images', async function(assert) {
    assert.expect(1);

    const image = {
      imageUrl: 'http://www.stuff.com/things/bees.png',
      primary: true,
      isNew: false
    };

    this.set('image', image);

    await render(hbs`
      {{image-upload
        image=image
      }}
    `);

    const filename = this.element.querySelector('.Image-Upload-previewFilename').textContent.trim();

    assert.equal(filename, 'bees.png');
  });

  test('Set image as primary', async function(assert) {
    assert.expect(1);

    const image = {
      imageUrl: imageUrl,
      primary: false
    };

    this.set('image', image);

    this.set('actions', {
      setPrimary: function(primaryImage) {
        assert.equal(primaryImage, image);
      }
    });

    await render(hbs`
      {{image-upload
        image=image
        setPrimary=(action 'setPrimary')
      }}
    `);

    await click(this.element.querySelector('.ImageUpload-setPrimary'));

  });
});
