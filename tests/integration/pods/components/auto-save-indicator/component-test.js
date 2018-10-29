import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | auto save indicator', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

    const subject = EmberObject.create({
      status: 'draft'
    });

    this.set('subject', subject);

    await render(hbs`
      {{#auto-save-indicator model=subject as |saveStatus|}}
        {{saveStatus}}
      {{/auto-save-indicator}}
    `);

    assert.equal(this.element.textContent.trim(), 'all changes saved.');

    this.set('subject.pubDate', new Date());

    assert.equal(this.element.textContent.trim(), 'all changes saved.');
  });
});
