import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForComponent('modals/user-menu', 'Integration | Component | modals/user menu', {
  integration: true
});

test('modals/user-menu content ', function(assert) {

  this.render(hbs`{{modals/user-menu}}`);

  assert.ok(this.$(testSelector('component', 'user-menu-identity-switcher')).length,
    "Identity Switcher is visible"
  );
});
