import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('x-comments', 'Integration | Component | comments section', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  //
  this.set('afterComment', () => {});

  this.render(hbs`{{comments-section
    afterComment=(action afterComment)
  }}`);

  assert.equal(this.$().text().trim(), '');
});
