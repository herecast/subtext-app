import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('x-modal', 'Integration | Component | x modal', {
  integration: true
});

test('it renders', function(assert) {
  let modalDialogService = this.container.lookup('service:modal-dialog');
  modalDialogService.destinationElementId = 'modal-overlays';

  assert.ok(this.$());
});
