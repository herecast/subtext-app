import { moduleForComponent, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';

const imageUrl = 'data:image/gif;base64,R0lGOD lhCwAOAMQfAP////7+/vj4+Hh4eHd3d/v7+/Dw8HV1dfLy8ubm5vX19e3t7fr 6+nl5edra2nZ2dnx8fMHBwYODg/b29np6eujo6JGRkeHh4eTk5LCwsN3d3dfX 13Jycp2dnevr6////yH5BAEAAB8ALAAAAAALAA4AAAVq4NFw1DNAX/o9imAsB tKpxKRd1+YEWUoIiUoiEWEAApIDMLGoRCyWiKThenkwDgeGMiggDLEXQkDoTh CKNLpQDgjeAsY7MHgECgx8YR8oHwNHfwADBACGh4EDA4iGAYAEBAcQIg0Dk gcEIQA7';


moduleForComponent('image-load-placeholder', 'Integration | Component | image load placeholder', {
  integration: true
});



test('Yields when image is loaded', function(assert) {

  this.set('imageUrl', imageUrl);

  // Template block usage:
  this.render(hbs`
    {{#image-load-placeholder imageUrl=imageUrl}}
      template block text
    {{/image-load-placeholder}}
  `);

  return wait().then(() => {
    assert.equal(this.$().text().trim(), 'template block text');
  });

});
