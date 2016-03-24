import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
/* global sinon */

moduleForComponent('directory-results-sort', 'Integration | Component | directory results sort', {
  integration: true
});

test('it renders with expected options', function(assert) {
  const expectedOptions = [
    {label: "Best Score", value: 'score_desc'},
    {label: "Closest", value: 'distance_asc'},
    {label: "Most Rated", value: 'rated_desc'},
    {label: "A to Z", value: 'alpha_asc'},
    {label: "Z to A", value: 'alpha_desc'}
  ];

  this.render(hbs`{{directory-results-sort}}`);
  const $select = this.$('.DirectoryResults-sort select');

  expectedOptions.forEach( (option) => {
    var $option = $select.find(`option[value=${option.value}]`);
    assert.ok($option.length > 0);
    assert.equal($option.text(), option.label);
  });

});

test('Sort value is set by sortBy parameter', function(assert) {
  this.set('sortBy', 'score_desc');

  this.render(hbs`{{directory-results-sort sortBy=sortBy}}`);
  var $select = this.$('.DirectoryResults-sort select');

  assert.equal($select.val(), 'score_desc');

  this.set('sortBy', 'distance_asc');
  assert.equal($select.val(), 'distance_asc');
});

test('Selecting a sortBy option triggers on-update action with the correct value', function(assert) {
  let myAction = sinon.spy();
  this.set('myAction', myAction);
  this.render(hbs`{{directory-results-sort on-update=(action myAction)}}`);

  let $select = this.$('.DirectoryResults-sort select');

  $select.val('distance_asc').change();
  assert.ok(myAction.calledWith('distance_asc'));
});
