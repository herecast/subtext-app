import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | organization profile desktop image', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{organization-profile-desktop-image imageUrl='http://asdf.com/images'}}`);

    assert.ok(this.element);
  });
});
