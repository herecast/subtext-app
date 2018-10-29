import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
const contactPoster = 'contact-poster-button';

module('Integration | Component | contact poster button', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders if model has contactEmail', async function(assert) {
    assert.expect(2);
    this.set('model', {
      contactEmail: 'asdf@asdf.com'
    });
    this.set('testAction', () => {
      assert.ok(true, 'clickReplyButton action was invoked!');
    });

    await render(hbs`{{contact-poster-button
        model=model
        clickReplyButton=(action testAction)
    }}`);

    assert.equal(this.element.querySelector(`[data-test-link=${contactPoster}] span`).textContent.trim(), 'Contact');

    await click(`[data-test-link=${contactPoster}] span`);
  });

  test('it renders if model has contactPhone', async function(assert) {
    assert.expect(2);
    this.set('model', {
      contactPhone: '9999999999'
    });
    this.set('testAction', () => {
      assert.ok(true, 'clickReplyButton action was invoked!');
    });

    await render(hbs`{{contact-poster-button
        model=model
        clickReplyButton=(action testAction)
    }}`);

    assert.equal(this.element.querySelector(`[data-test-link=${contactPoster}] span`).textContent.trim(), 'Contact');

    await click(`[data-test-link=${contactPoster}] span`);
  });

  test('it does not render a button if model had no contactEmail or contactPhone', async function(assert) {
    assert.expect(1);
    this.set('model', {});

    await render(hbs`{{contact-poster-button
        model=model
    }}`);

    assert.notOk(this.element.querySelector(`[data-test-link=${contactPoster}] span`));
  });
});
