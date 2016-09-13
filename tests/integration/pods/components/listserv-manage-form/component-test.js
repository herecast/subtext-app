import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('listserv-manage-form', 'Integration | Component | listserv manage form', {
  integration: true
});

test('offers user to unsubscribe if user is already subscribed', function(assert) {
  const model = {
    email: 'string',
    unsubscribedAt: null,
    listserv: {
      name: 'string',
      id: 1
    }
  };

  this.set('model', model);

  this.render(hbs`{{listserv-manage-form model=model}}`);

  const $subscribeButton = $('.subscribe-button');

  assert.ok($subscribeButton.hasClass('unsubscribe'), 'listserv-manage-form should offer to unsubscribe if user is already subscribed');
});

test('offers user to resubscribe if user is not subscribed', function(assert) {
  const model = {
    email: 'string',
    unsubscribedAt: '2014-10-13T00:00:00.000Z',
    listserv: {
      name: 'string',
      id: 1
    }
  };

  this.set('model', model);

  this.render(hbs`{{listserv-manage-form model=model}}`);

  const $subscribeButton = $('.subscribe-button');

  assert.ok($subscribeButton.hasClass('resubscribe'), 'listserv-manage-form should offer to resubscribe if user is not subscribed');
});
