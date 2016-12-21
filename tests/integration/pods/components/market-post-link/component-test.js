import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('market-post-link', 'Integration | Component | market post link', {
  integration: true
});

test('it renders', function(assert) {
  this.set('externalAction', () => {});

  this.render(hbs`
    {{#market-post-link
      onTitleClick=(action externalAction)
      trackSuggestedContentClick=(action externalAction)
    }}
      template block text
    {{/market-post-link}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});