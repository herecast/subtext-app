import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | mystuff/comment card', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    const comment = {
      title: 'Best Comment',
      content: '<p>Best Content</p>'
    };

    this.set('comment', comment);

    await render(hbs`{{mystuff/comment-card comment=comment}}`);

    assert.ok(this.element, 'comment card renders');

    assert.equal(this.element.querySelector('.Mystuff-CommentCard-title a').textContent.trim(), 'Best Comment', 'has correct title');

    assert.equal(this.element.querySelector('.Comment-content').textContent.trim(), 'Best Content', 'has correct content');
  });
});
