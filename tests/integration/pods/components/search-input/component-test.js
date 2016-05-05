import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import jQuery from 'jquery';

moduleForComponent('search-input', 'Integration | Component | search input', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{search-input}}`);

  assert.equal(this.$().text().trim(), '');

});

test('pressing ESC clears the value', function(assert) {
  this.set('value', "Taco");
  
  this.render(hbs`{{search-input value=value update=(action (mut value)) debounceWait=0}}`);
  
  const escKey = 27;
  let $inp = this.$('input');  
  $inp.val('query');
  
  let evt = jQuery.Event('keyup', {which: escKey});
  $inp.trigger(evt);
  
  assert.equal($inp.val(), "");
});

test('pressing the x button clears the value', function(assert) {
  this.render(hbs`{{search-input value=value update=(action (mut value)) debounceWait=0}}`);
  
  let $inp = this.$('input');  
  let $x = this.$('SearchInput-clear');
  
  $x.trigger('click');
  assert.equal($inp.val(), "");
});
