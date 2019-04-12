import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | avatar image', function(hooks) {
  setupRenderingTest(hooks);

  const imageUrl = 'https://via.placeholder.com/300x240.png?text=300x200';

  test('It renders an image when provided with one', async function(assert) {

    this.set('imageUrl', imageUrl);
    await render(hbs`{{avatar-image imageUrl=imageUrl}}`);

    assert.ok(this.element.querySelector('img'));

  });

  test('It renders initials when provided with a name and no image', async function(assert) {

    this.set('imageUrl', '');
    this.set('userName', 'A Night To Remember');

    await render(hbs`{{avatar-image userName=userName}}`);

    assert.notOk(this.element.querySelector('img'));
    assert.equal(this.element.querySelector('.AvatarImage--default').getAttribute('data-content'), 'NR');

  });
});
