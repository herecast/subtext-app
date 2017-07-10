import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from '../../../../helpers/setup-mirage';

moduleForComponent('market-detail', 'Integration | Component | market detail', {
  integration: true,
  setup() {
    startMirage(this.container);
    this.inject.service('tracking');
  }
});

test('it renders', function(assert) {
  this.set('scrollToMock', () => {});

  this.render(hbs`
    {{market-detail
      model=model
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

  this.set('market', {id: 1, contentId: 2});
  this.set('scrollToMock', () => {});

  this.render(hbs`
    {{market-detail
      model=market
      scrollTo=(action scrollToMock)
    }}
  `);

    assert.ok(
      impressions.indexOf(2) > -1,
      'After render, records impression through tracking service');

    this.set('market', {id: 4, contentId: 5});

    assert.ok(
      impressions.indexOf(5) > -1,
      'it records a new impression when given a new model');
});
