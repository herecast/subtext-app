import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('x-modal', 'Integration | Component | x modal', {
  integration: true
});

test('it renders', function(assert) {
  let modalDialogService = this.container.lookup('service:modal-dialog');
  modalDialogService.destinationElementId = 'modal-overlays';

  // Template block usage:" + EOL +
  this.render(hbs`
    <div id='modal-overlays'></div>
    {{#x-modal}}
      template block text
    {{/x-modal}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
