import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('directory-business-info', 'Integration | Component | directory business info', {
  integration: true
});

test('it renders', function(assert) {

  const model = {
    details: '<p></p>'
  };
  
  this.set('model', model);

  this.render(hbs`{{directory-business-info model=model}}`);

  assert.equal(this.$().text().trim(), '');

});
