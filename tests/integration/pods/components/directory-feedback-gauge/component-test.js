import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('directory-feedback-gauge', 'Integration | Component | directory feedback gauge', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
  this.set('percent',70);
  this.set('side',100);

  this.render(hbs`{{directory-feedback-gauge value=percent size=side}}`);

  assert.ok(this.$('.DirectoryFeedbackGauge-center').length > 0, 'no pass');


});
