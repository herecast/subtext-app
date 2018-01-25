import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('organization-profile-desktop-image', 'Integration | Component | organization profile desktop image', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{organization-profile-desktop-image imageUrl='http://asdf.com/images'}}`);

  assert.ok(this.$());
});
