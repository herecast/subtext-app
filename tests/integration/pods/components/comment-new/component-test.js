import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerKeyEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | comment new', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{comment-new}}`);

    assert.ok(this.element);
  });

  test('it sanitizes', async function(assert) {
    const iframe = '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';

    this.set('commentText', `abcdef-${iframe}-ghik`);

    await render(hbs`{{comment-new newComment=commentText}}`);

    await triggerKeyEvent(this.element.querySelector('textarea'), 'keyup', 13);

    assert.equal(this.element.querySelector('textarea').value, 'abcdef--ghik', 'Should strip all html from comments');
  });

  test('it truncates', async function(assert) {
    const longText = 'And then I went to the town where they have dogs and cats and little matchstick boys selling all kinds of cigars and sundries to the lonely folks in their dwellings with red metal roofs and baskets for windows that shake as the wind blows through their openings and fun times.';
    const maxLength = 200;

    this.set('longText', longText);
    this.set('maxLength', maxLength);

    await render(hbs`{{comment-new newComment=longText maxCommentLength=maxLength}}`);

    await triggerKeyEvent(this.element.querySelector('textarea'), 'keyup', 13);

    assert.equal(this.element.querySelector('textarea').value.length, maxLength, 'Should truncate text to max length set in component');
  });
});
