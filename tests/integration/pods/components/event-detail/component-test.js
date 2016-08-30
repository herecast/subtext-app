import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from '../../../../helpers/setup-mirage';

moduleForComponent('event-detail', 'Integration | Component | event detail', {
  integration: true,
  setup() {
    startMirage(this.container);
  }
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('scrollToMock', () => {});

  this.render(hbs`
   {{event-detail
     scrollTo=(action scrollToMock)
   }}
  `);

  assert.ok(this.$().text().trim());
});
