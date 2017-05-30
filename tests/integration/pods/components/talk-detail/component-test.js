import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from '../../../../helpers/setup-mirage';

moduleForComponent('talk-detail', 'Integration | Component | talk detail', {
  integration: true,
  setup() {
    startMirage(this.container);
    this.inject.service('api');
  }
});

test('it renders', function(assert) {
  assert.expect(1);
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('model', {});

  this.render(hbs`{{talk-detail model=model}}`);

  assert.ok(this.$());
});

test('Tracking impressions', function(assert) {
  assert.expect(2);

  let impressions = [];

  this.api.reopen({
    recordContentImpression(id) {
      impressions.push(id);
      this._super(id);
    }
  });

  this.set('talk', {id: 1});
  this.set('scrollToMock', () => {});

  this.render(hbs`
    {{talk-detail
      model=talk
      scrollTo=(action scrollToMock)
    }}
  `);

    assert.ok(
      impressions.indexOf(1) > -1,
      'After render, api receives trackContentImpression');

    this.set('talk', {id: 2});

    assert.ok(
      impressions.indexOf(2) > -1,
      'it records a new impression when given a new model');
});
