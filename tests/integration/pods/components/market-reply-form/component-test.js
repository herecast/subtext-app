import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('market-reply-form', 'Integration | Component | market reply form', {
  integration: true
});

test('it renders', function(assert) {
  this.set('clickReplyButton', () => {});


  this.render(hbs`
    {{market-reply-form
      post=(readonly model)
      clickReplyButton=(action clickReplyButton)
    }}
  `);

  assert.ok(this.$());
});
