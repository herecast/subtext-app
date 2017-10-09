import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('feed-card/comments', 'Integration | Component | feed card/comments', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('stubbedAction', () => {});

  this.render(hbs`
    {{feed-card/comments
      afterComment=(action stubbedAction)
    }}`
  );

  assert.equal(this.$().text().trim(), '');
});
