import Ember from 'ember';
import startMirage from 'subtext-ui/tests/helpers/setup-mirage';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const promotionStub = Ember.Service.extend({
  find() {
    return { then() {} };
  }
});

moduleForComponent('news-detail', 'Integration | Component | news detail', {
  integration: true,

  beforeEach() {
    startMirage(this.container);

    this.register('service:promotion', promotionStub);
    this.inject.service('promotion');
    this.inject.service('tracking');
  },
  afterEach() {
    window.server.shutdown();
  }
});

test('it renders', function(assert) {
  assert.expect(1);
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
  this.set('news', {id: 1});
  this.set('scrollToMock', () => {});

  this.render(hbs`
    {{news-detail
      model=news
      scrollTo=(action scrollToMock)
    }}
  `);

  assert.ok(this.$().text().trim());
});

test('Tracking impressions', function(assert) {
  assert.expect(2);

  let impressions = [];

  this.tracking.reopen({
    contentImpression(id) {
      impressions.push(id);
    }
  });

  this.set('news', {id: 1});
  this.set('scrollToMock', () => {});

  this.render(hbs`
    {{news-detail
      attr=attr
      model=news
      scrollTo=(action scrollToMock)
    }}
  `);

    assert.ok(
      impressions.indexOf(1) > -1,
      'After render, records impression through tracking service');

    this.set('news', {id: 2});
    assert.ok(
      impressions.indexOf(2) > -1,
      'it records a new impression when given a new model');
});
