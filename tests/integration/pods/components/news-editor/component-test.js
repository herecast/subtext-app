import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import RSVP from 'rsvp';

module('Integration | Component | news editor', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const organizations =  [{id: 1, can_publish_news: true }];
    this.set('organizations', organizations);

    const model = {
      location: RSVP.resolve({city: 'Hanover', state: 'NH'})
    };

    this.set('model', model);
    await render(hbs`{{news-editor organizations=organizations news=model}}`);
    assert.ok(this.element);
  });
});
