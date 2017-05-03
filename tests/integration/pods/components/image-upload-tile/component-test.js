import { moduleForComponent, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';
import createImageFixture from 'subtext-ui/tests/helpers/create-image-fixture';
import Ember from 'ember';

const {isPresent} = Ember;

moduleForComponent('image-upload-tile', 'Integration | Component | image upload tile', {
  integration: true
});

test('Given a model with imageUrl', function(assert) {

  const model = {
    imageUrl: "data:image/gif;base64,R0lGOD lhCwAOAMQfAP////7+/vj4+Hh4eHd3d/v7+/Dw8HV1dfLy8ubm5vX19e3t7fr 6+nl5edra2nZ2dnx8fMHBwYODg/b29np6eujo6JGRkeHh4eTk5LCwsN3d3dfX 13Jycp2dnevr6////yH5BAEAAB8ALAAAAAALAA4AAAVq4NFw1DNAX/o9imAsB tKpxKRd1+YEWUoIiUoiEWEAApIDMLGoRCyWiKThenkwDgeGMiggDLEXQkDoTh CKNLpQDgjeAsY7MHgECgx8YR8oHwNHfwADBACGh4EDA4iGAYAEBAcQIg0Dk gcEIQA7"
  };

  this.setProperties({model});

  this.render(hbs`{{image-upload-tile model=model}}`);

  assert.ok(
    this.$(`.ImageTile img[src="${model.imageUrl}"]`).length > 0,
    "It renders an ImageTile with the imageUrl passed through"
  );

  assert.ok(
    this.$('.ImageUploadTile-inputTile').length === 0,
    "Upload control is not visible"
  );
});

test('Given a model without imageUrl', function(assert) {
  const done = assert.async();

  const model = {
    imageUrl: undefined
  };

  this.setProperties({model});

  this.render(hbs`{{image-upload-tile model=model}}`);

  assert.ok(
    this.$('.ImageUploadTile-inputTile').length > 0,
    "Upload control is visible"
  );

  return createImageFixture(200,200).then((file) => {
    this.$('.ImageUploadTile-inputTile input[type=file]').triggerHandler({
      type: "change",
      target: {
        files: [file]
      }
    });

    return wait().then(()=> {
      assert.ok(
        isPresent(model.imageUrl),
        "image property is set on model after selecting image"
      );

      assert.ok(
        model.imageUrl.indexOf('data:image') > -1,
        "imageUrl updated to data url, after selecting image"
      );

      assert.ok(
        this.$('.ImageUploadTile-imageTile').length > 0,
        "An image is shown, after selecting image"
      );


      assert.ok(
        this.$('.ImageUploadTile-inputTile').length === 0,
        "Upload control is not visible"
      );

      done();
    });
  });
});
