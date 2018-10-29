import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | image upload list', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    this.set('model', {
      images: []
    });

    await render(hbs`{{image-upload-list model=model}}`);

    assert.ok(this.element);
  });
});
