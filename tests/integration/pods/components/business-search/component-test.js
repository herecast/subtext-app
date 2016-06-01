import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('business-search', 'Integration | Component | business search', {
  integration: true,
  beforeEach() {
    this.set('updateFromQuery', () => {});
  }
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`
    {{business-search
      updateFromQuery=(action updateFromQuery)
    }}
  `);

  assert.equal(this.$().text().trim(), '');
});
