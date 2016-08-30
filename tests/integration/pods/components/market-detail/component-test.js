import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from '../../../../helpers/setup-mirage';

moduleForComponent('market-detail', 'Integration | Component | market detail', {
  integration: true,
  setup() {
    startMirage(this.container);
  }
});

test('it renders', function(assert) {
  this.set('model', {});
  this.set('scrollToMock', () => {});

  this.render(hbs`
    {{market-detail
      model=model
      scrollTo=(action scrollToMock)
    }}
  `);

  assert.ok(this.$().text().trim());
});
