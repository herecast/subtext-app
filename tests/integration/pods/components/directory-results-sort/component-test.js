import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | directory results sort', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders with expected options', async function(assert) {
    const expectedOptions = [
      {label: "Best Score", value: 'score_desc'},
      {label: "Closest", value: 'distance_asc'},
      {label: "Most Rated", value: 'rated_desc'},
      {label: "A to Z", value: 'alpha_asc'}
    ];

    await render(hbs`{{directory-results-sort}}`);
    const $select = this.element.querySelector('.DirectoryResults-sort select');

    expectedOptions.forEach( (option) => {
      var $option = $select.querySelector(`option[value=${option.value}]`);
      assert.ok($option);
      assert.equal($option.textContent, option.label);
    });

  });

  test('Sort value is set by sortBy parameter', async function(assert) {
    this.set('sortBy', 'score_desc');

    await render(hbs`{{directory-results-sort sortBy=sortBy}}`);
    var $select = this.element.querySelector('.DirectoryResults-sort select');

    assert.equal($select.value, 'score_desc');

    this.set('sortBy', 'distance_asc');
    assert.equal($select.value, 'distance_asc');
  });

  test('Selecting a sortBy option triggers onSortChange action with the correct value', async function(assert) {
    let myAction = sinon.spy();
    this.set('myAction', myAction);
    await render(hbs`{{directory-results-sort onSortChange=(action myAction)}}`);

    let $select = this.element.querySelector('.DirectoryResults-sort select');

    await fillIn($select, 'distance_asc');

    assert.ok(myAction.calledWith('distance_asc'));
  });
});
