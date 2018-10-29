import sinon from 'sinon';
import Service from '@ember/service';

import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

let mockModel, mockTrackingService;

module('Integration | Component | modals/contact poster', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    mockTrackingService = Service.extend({ push: sinon.spy()});

    this.owner.register('service:tracking', mockTrackingService );
    this.tracking = this.owner.lookup('service:tracking');

    mockModel = {
      publishedAt: {
        format() {
          return `Some date in the not so distant future`;
        }
      },
      authorName: `Billie-Joe Nelson`,
      content: `Some nonsense goes here`,
      contactEmail:`Billie@OKCoral.com`,
      title: `This is NO JOKE`,
      contactPhone: `555-555-5555`
    };
  });

  test('it renders', async function(assert) {
    assert.expect(8);

    this.set('model', mockModel);
    this.set('mailToParts', {});

    await render(hbs`{{modals/contact-poster model=model mailToParts=mailToParts}}`);

    assert.ok(this.element.textContent.trim().includes('Contact Info'), 'Modal header is displayed.');
    assert.ok(this.element.textContent.trim().includes('Email'), 'Email is displayed.');
    assert.ok(this.element.textContent.trim().includes('Billie@OKCoral.com'), 'Email value is displayed.');
    assert.ok(this.element.textContent.trim().includes('Phone'), 'Phone Number is displayed.');
    assert.ok(this.element.textContent.trim().includes('555-555-5555'), 'Phone Number value is displayed.');

    assert.equal(this.element.querySelector('[data-test-gmail-link]').textContent.trim(), 'Gmail', 'Gmail button is displayed');
    assert.equal(this.element.querySelector('[data-test-outlook-link]').textContent.trim(), 'Outlook', 'Outlook button is displayed');
    assert.equal(this.element.querySelector('[data-test-yahoo-link]').textContent.trim(), 'Yahoo', 'Yahoo button is displayed');
  });

  test('it renders with the right vlues', async function(assert) {
    assert.expect(5);

    this.set('model', mockModel);

    await render(hbs`{{modals/contact-poster model=model}}`);

    assert.deepEqual(this.tracking.push.args[0][0], {'event': 'market-reply-click'}, 'Tracking service was called with the right info.');

    run(() => {
      this.element.querySelector('[data-test-gmail-link]').click();
    });

    assert.deepEqual(this.tracking.push.args[1][0], {'event': 'market-reply-email-click', 'email-choice': 'Google'}, 'Tracking service was called with the right info.');

    run(() => {
      this.element.querySelector('[data-test-outlook-link]').click();
    });

    assert.deepEqual(this.tracking.push.args[2][0], {'event': 'market-reply-email-click', 'email-choice': 'Outlook'}, 'Tracking service was called with the right info.');

    run(() => {
      this.element.querySelector('[data-test-yahoo-link]').click();
    });

    assert.deepEqual(this.tracking.push.args[3][0], {'event': 'market-reply-email-click', 'email-choice': 'Yahoo'}, 'Tracking service was called with the right info.');

    run(() => {
      this.element.querySelector('[data-test-client-link]').click();
    });

    assert.deepEqual(this.tracking.push.args[4][0], {'event': 'market-reply-email-click', 'email-choice': 'Client'}, 'Tracking service was called with the right info.');
  });
});
