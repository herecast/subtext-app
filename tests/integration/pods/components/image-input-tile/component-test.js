/* global Blob */
import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import createImageFixture from 'subtext-ui/tests/helpers/create-image-fixture';

const { RSVP } = Ember;

moduleForComponent('image-input-tile', 'Integration | Component | image input tile', {
  integration: true
});

test('selecting a file', function(assert) {
  const done = assert.async();

  this.setProperties({
    imageAdded({file, img}) {
      assert.equal(file.type, 'image/jpeg',
        'It passes a file object to the action'
      );

      assert.ok(
        img.src.indexOf('data:image') > -1,
        "it passes an image object with src equal to data url"
      );

      assert.equal(img.height,200, 'height is available');
      assert.equal(img.width,200, 'width is available');

      done();
    }
  });

  this.render(hbs`{{image-input-tile action=(action imageAdded)}}`);

  createImageFixture(200,200).then((file)=> {
    this.$('input.ImageInputTile-input').triggerHandler({
      type: 'change',
      target: {
        files: [
          file
        ]
      }
    });
  });
});

test('selecting a large file that is too wide', function(assert) {
  const done = assert.async();

  this.setProperties({
    imageAdded({file, img}) {
      assert.equal(img.width, 1600, 'width is constrained to the max dimension (default 1600)');
      assert.equal(img.height, 800, 'height is scaled proportionately');

      done();
    }
  });

  this.render(hbs`{{image-input-tile action=(action imageAdded)}}`);

  createImageFixture(2000,1000).then((file)=> {
    this.$('input.ImageInputTile-input').triggerHandler({
      type: 'change',
      target: {
        files: [
          file
        ]
      }
    });
  });
});

test('selecting a large file that is too tall', function(assert) {
  const done = assert.async();

  this.setProperties({
    imageAdded({file, img}) {
      assert.equal(img.height, 1600, 'height is constrained to the max dimension (default 1600)');
      assert.equal(img.width, 800, 'width is scaled proportionately');

      done();
    }
  });

  this.render(hbs`{{image-input-tile action=(action imageAdded)}}`);

  createImageFixture(1000,2000).then((file)=> {
    this.$('input.ImageInputTile-input').triggerHandler({
      type: 'change',
      target: {
        files: [
          file
        ]
      }
    });
  });
});

test('selecting multiple files', function(assert) {
  const done = assert.async(3);
  assert.expect(3);

  let addImageCount = 0;

  this.setProperties({
    imageAdded() {
      addImageCount++;

      assert.ok(true, 'it calls action for image: ' + addImageCount);

      done();
    }
  });

  this.render(hbs`{{image-input-tile multiple=true action=(action imageAdded)}}`);

  RSVP.all([
    createImageFixture(200,200),
    createImageFixture(200,200),
    createImageFixture(204,206)
  ]).then((files)=> {
    this.$('input.ImageInputTile-input').triggerHandler({
      type: 'change',
      target: {
        files: files
      }
    });
  });
});

test('selecting a small image', function(assert) {
  const done = assert.async();

  this.setProperties({
    onError(e) {
      assert.equal(e.message,
        'Image must have minimum dimensions of 200x200',
        'it calls error action with minimum size error'
      );

      done();
    }
  });

  this.render(hbs`{{image-input-tile onError=(action onError)}}`);

  createImageFixture(100,100).then((file)=> {
    this.$('input.ImageInputTile-input').triggerHandler({
      type: 'change',
      target: {
        files: [
          file
        ]
      }
    });
  });
});

test('selecting a non-image', function(assert) {
  const done = assert.async();
  const file = new Blob([], {type: 'text/html'});

  this.setProperties({
    onError(e) {
      assert.equal(e.message,
        'File must be an image',
        'it calls error action with file type error'
      );

      done();
    }
  });

  this.render(hbs`{{image-input-tile onError=(action onError)}}`);

  this.$('input.ImageInputTile-input').triggerHandler({
    type: 'change',
    target: {
      files: [
        file
      ]
    }
  });
});
