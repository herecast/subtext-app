import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startApp from 'subtext-ui/tests/helpers/start-app';
import wait from 'ember-test-helpers/wait';

moduleForComponent('biz-feed/promotion-history', 'Integration | Component | biz feed/promotion history', {
  integration: true
});

test('it renders', function(assert) {
  startApp();
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('content', {id: 10});
  this.render(hbs`{{biz-feed/promotion-history content=content}}`);

  return wait().then(() => {
    assert.ok(this.$());
  });
});
