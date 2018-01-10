/* global sinon */
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import testSelector from 'ember-test-selectors';

const { Service, run } = Ember;

let mockModel, mockTrackingService;

moduleForComponent('modals/contact-poster', 'Integration | Component | modals/contact poster', {
  integration: true,

  beforeEach() {
    mockTrackingService = Service.extend({ push: sinon.spy()});

    this.register('service:tracking', mockTrackingService );
    this.inject.service('tracking');

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
  }
});

test('it renders', function(assert) {
  assert.expect(8);

  this.set('model', mockModel);
  this.set('mailToParts', {});

  this.render(hbs`{{modals/contact-poster model=model mailToParts=mailToParts}}`);

  assert.ok(this.$().text().trim().includes('Contact Info'), 'Modal header is displayed.');
  assert.ok(this.$().text().trim().includes('Email'), 'Email is displayed.');
  assert.ok(this.$().text().trim().includes('Billie@OKCoral.com'), 'Email value is displayed.');
  assert.ok(this.$().text().trim().includes('Phone'), 'Phone Number is displayed.');
  assert.ok(this.$().text().trim().includes('555-555-5555'), 'Phone Number value is displayed.');

  assert.equal(this.$(testSelector('gmail-link')).text().trim(), 'Gmail', 'Gmail button is displayed');
  assert.equal(this.$(testSelector('outlook-link')).text().trim(), 'Outlook', 'Outlook button is displayed');
  assert.equal(this.$(testSelector('yahoo-link')).text().trim(), 'Yahoo', 'Yahoo button is displayed');
});

test('it renders with the right vlues', function(assert) {
  assert.expect(5);

  this.set('model', mockModel);

  this.render(hbs`{{modals/contact-poster model=model}}`);

  assert.deepEqual(this.tracking.push.args[0][0], {'event': 'market-reply-click'}, 'Tracking service was called with the right info.');

  run(() => {
    this.$(testSelector('gmail-link')).click();
  });

  assert.deepEqual(this.tracking.push.args[1][0], {'event': 'market-reply-email-click', 'email-choice': 'Google'}, 'Tracking service was called with the right info.');

  run(() => {
    this.$(testSelector('outlook-link')).click();
  });

  assert.deepEqual(this.tracking.push.args[2][0], {'event': 'market-reply-email-click', 'email-choice': 'Outlook'}, 'Tracking service was called with the right info.');

  run(() => {
    this.$(testSelector('yahoo-link')).click();
  });

  assert.deepEqual(this.tracking.push.args[3][0], {'event': 'market-reply-email-click', 'email-choice': 'Yahoo'}, 'Tracking service was called with the right info.');

  run(() => {
    this.$(testSelector('client-link')).click();
  });

  assert.deepEqual(this.tracking.push.args[4][0], {'event': 'market-reply-email-click', 'email-choice': 'Client'}, 'Tracking service was called with the right info.');
});
