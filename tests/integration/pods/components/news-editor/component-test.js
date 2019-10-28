import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Session from 'subtext-app/services/session';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { resolve } from 'rsvp';

module('Integration | Component | news editor', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

    let proxy = ObjectPromiseProxy.create({
      promise: resolve({})
    });

    this.owner.register('service:session', Session.extend({
      currentUser: proxy
    }));

    const location = {
      id: 1,
      city: 'city',
      state: 'ST'
    };

    this.set('news', {
      location: resolve(location)
    });

    await render(hbs`{{news-editor news=news}}`);

    assert.ok(this.element);
  });
});
