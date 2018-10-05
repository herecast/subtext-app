import { test } from 'qunit';
import { invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'ember-test-selectors';
import mockCookies from 'subtext-ui/tests/helpers/mock-cookies';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import Ember from 'ember';

moduleForAcceptance('Acceptance | app download nag', {
  beforeEach() {
    invalidateSession(this.application);
    this.cookies = {};
    mockCookies(this.application, this.cookies);
  }
});

test('Visiting homepage from Mobile Browser (not native app)', function(assert) {
  const media = Ember.Service.extend({
    isMobileButNotNative: true
  });

  this.application.register('services:mediaMock', media);
  this.application.inject('component', 'media', 'services:mediaMock');

  visit('/');

  andThen(function() {
    assert.equal(find(testSelector('nag-visible')).length, 1, 'Should show nag when visited from mobile device not in native app');

    click(find(testSelector('action', 'close-nag'))[0]);

    andThen(function() {
      assert.equal(find(testSelector('nag-visible')).length, 0, 'Should hide nag when close button clicked');
    });
  });
});


test('Visiting homepage from Mobile Browser (not native app) and Cookie present', function(assert) {
  const media = Ember.Service.extend({
    isMobileButNotNative: true
  });

  this.application.register('services:mediaMock', media);
  this.application.inject('component', 'media', 'services:mediaMock');

  this.cookies['hideAppDownloadNag'] = true;

  visit('/');

  andThen(function() {
    assert.equal(find(testSelector('nag-visible')).length, 0, 'Should not show nag when visited from mobile device not in native app and cookie present');
  });
});

test('Visiting homepage from Native App', function(assert) {
  const media = Ember.Service.extend({
    isMobileButNotNative: false
  });

  this.application.register('services:mediaMock', media);
  this.application.inject('component', 'media', 'services:mediaMock');

  visit('/');

  andThen(function() {
    assert.equal(find(testSelector('nag-visible')).length, 0, 'Should not show nag when visited from native mobile app');
  });
});

test('Visiting homepage from non mobile device', function(assert) {
  const media = Ember.Service.extend({
    isMobileButNotNative: false
  });

  this.application.register('services:mediaMock', media);
  this.application.inject('component', 'media', 'services:mediaMock');

  visit('/');

  andThen(function() {
    assert.equal(find(testSelector('nag-visible')).length, 0, 'Should not show nag when visited from non mobile device');
  });
});
