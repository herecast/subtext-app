import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('talk-card', 'Integration | Component | Talk Card', {
  integration: true
});


test('it renders', function(assert){
  assert.expect(1);
  assert.ok(this.$());
});
