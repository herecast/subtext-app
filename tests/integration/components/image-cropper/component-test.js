import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('image-cropper', 'Integration | Component | image cropper', {
  integration: true,

  beforeEach: () => { },
  afterEach: () => { }
});

test ('it cancels', function(assert) {
  assert.expect(1);

  Ember.run.debounce = function(context, action, value) {
    action.call(context, value);
  };

  this.set('originalImageFile', { type: 'image/gif' });

  this.set('actions', {
    hideCropper: function() {
      assert.ok(true, 'hideCropper is called on the parent');
    }
  });

  // we need to set up the canvas element and stub out the toDataUrl method
  // since it is not available to us...
  this.render(hbs`<canvas width="1000" height="607"></canvas>`);
  var canvas = $('canvas');
  canvas.toDataURL = () => {
    return 'data:image/gif;base64,R0lGOD lhCwAOAMQfAP////7+/vj4+Hh4eHd3d/v7+/Dw8HV1dfLy8ubm5vX19e3t7fr 6+nl5edra2nZ2dnx8fMHBwYODg/b29np6eujo6JGRkeHh4eTk5LCwsN3d3dfX 13Jycp2dnevr6////yH5BAEAAB8ALAAAAAALAA4AAAVq4NFw1DNAX/o9imAsB tKpxKRd1+YEWUoIiUoiEWEAApIDMLGoRCyWiKThenkwDgeGMiggDLEXQkDoTh CKNLpQDgjeAsY7MHgECgx8YR8oHwNHfwADBACGh4EDA4iGAYAEBAcQIg0Dk gcEIQA7';
  };
  this.set('canvas', canvas);

  this.render(hbs`
    {{image-cropper
      type=originalImageFile.type
      canvas=canvas
      cancel=(action 'hideCropper')
    }}
  `);

  const $cancelButton = this.$().find("button:contains('Cancel')");

  $cancelButton.click();
});

test('it saves', function(assert) {
  assert.expect(3);

  this.set('originalImageFile', { type: 'image/gif' });

  Ember.run.debounce = function(context, action, value) {
    action.call(context, value);
  };

  this.set('actions', {
    updateImageModelProperties(image, imageUrl) {
      assert.ok(true, 'updateImageModelProperties is called on the parent');
      assert.deepEqual(typeof image, 'object', 'image should be an object with specified keys');
      assert.equal(imageUrl.match(/data:/)[0], "data:", 'imageUrl should be a dataURI');
    }
  });

  // we need to set up the canvas element and stub out the toDataUrl method since it is not available to us...
  this.render(hbs`<canvas width="1000" height="607"></canvas>`);
  var canvas = $('canvas');
  canvas.toDataURL = () => {
    return 'data:image/gif;base64,R0lGOD lhCwAOAMQfAP////7+/vj4+Hh4eHd3d/v7+/Dw8HV1dfLy8ubm5vX19e3t7fr 6+nl5edra2nZ2dnx8fMHBwYODg/b29np6eujo6JGRkeHh4eTk5LCwsN3d3dfX 13Jycp2dnevr6////yH5BAEAAB8ALAAAAAALAA4AAAVq4NFw1DNAX/o9imAsB tKpxKRd1+YEWUoIiUoiEWEAApIDMLGoRCyWiKThenkwDgeGMiggDLEXQkDoTh CKNLpQDgjeAsY7MHgECgx8YR8oHwNHfwADBACGh4EDA4iGAYAEBAcQIg0Dk gcEIQA7';
  };
  this.set('canvas', canvas);

  this.render(hbs`
    {{image-cropper
      type=originalImageFile.type
      canvas=canvas
      updateImage=(action 'updateImageModelProperties')
    }}
  `);

  const $saveButton = this.$().find("button:contains('Save')");

  Ember.run.later(() => {
    $saveButton.click();
  });
});
