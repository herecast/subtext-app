import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | pagination buttons', function(hooks) {
  setupRenderingTest(hooks);


  test('Previous button not visible on page 1', async function(assert) {
    this.setProperties({
      myAction: function() {},
      page: 1,
      per_page: 1,
      results: [{test: 'me'}, {test: 'me2'}]
    });

    await render(hbs`{{pagination-buttons
                        on-update-page=(action myAction)
                        page=page
                        perPage=per_page
                        results=results}}`);
    let $prevButton = this.element.querySelector('.PaginationButtons-prev');

    assert.notOk($prevButton);
  });

  test('Previous button visible on page 2', async function(assert) {
    this.setProperties({
      myAction: function() {},
      page: 2,
      per_page: 1,
      results: [{test: 'me'}, {test: 'me2'}]
    });

    await render(hbs`{{pagination-buttons
                        on-update-page=(action myAction)
                        page=page
                        perPage=per_page
                        results=results}}`);
    let $prevButton = this.element.querySelector('.PaginationButtons-prev');

    assert.ok($prevButton);
  });

  test('FirstPage button not visible on page 1', async function(assert) {
    this.setProperties({
      myAction: function() {},
      page: 1,
      per_page: 1,
      results: [{test: 'me'}, {test: 'me2'}]
    });

    await render(hbs`{{pagination-buttons
                        on-update-page=(action myAction)
                        page=page
                        perPage=per_page
                        results=results}}`);
    let $firstButton = this.element.querySelector('.PaginationButtons-first');

    assert.notOk($firstButton);
  });

  test('FirstPage button visible on page 2', async function(assert) {
    this.setProperties({
      myAction: function() {},
      page: 2,
      per_page: 1,
      results: [{test: 'me'}, {test: 'me2'}]
    });

    await render(hbs`{{pagination-buttons
                        on-update-page=(action myAction)
                        page=page
                        perPage=per_page
                        results=results}}`);
    let $firstButton = this.element.querySelector('.PaginationButtons-first');

    assert.ok($firstButton);
  });

  test('NextPage button not visible when results < per_page', async function(assert) {
    this.setProperties({
      myAction: function() {},
      page: 1,
      per_page: 3,
      results: [{test: 'me'}, {test: 'me2'}]
    });

    await render(hbs`{{pagination-buttons
                        on-update-page=(action myAction)
                        page=page
                        perPage=per_page
                        results=results}}`);
    let $nextButton = this.element.querySelector('.PaginationButtons-next');

    assert.notOk($nextButton);
  });

  test('Given no total parameter; NextPage button visible when results >= per_page', async function(assert) {
    this.setProperties({
      myAction: function() {},
      page: 2,
      per_page: 1,
      results: [{test: 'me'}, {test: 'me2'}]
    });

    await render(hbs`{{pagination-buttons
                        on-update-page=(action myAction)
                        page=page
                        perPage=per_page
                        results=results}}`);
    let $nextButton = this.element.querySelector('.PaginationButtons-next');

    assert.ok($nextButton);
  });

  test('Given a total parameter; NextPage button visible when page * per_page < total', async function(assert) {
    this.setProperties({
      myAction: function() {},
      total: 5,
      page: 2,
      per_page: 2,
      results: [{test: 'me'}]
    });

    await render(hbs`{{pagination-buttons
                        on-update-page=(action myAction)
                        total=total
                        page=page
                        perPage=per_page
                        results=results}}`);
    let $nextButton = this.element.querySelector('.PaginationButtons-next');

    assert.ok($nextButton);
  });

  test('Given a total parameter; NextPage button not visible when page * per_page = total and per_page == results', async function(assert) {
    this.setProperties({
      myAction: function() {},
      total: 3,
      page: 2,
      per_page: 1,
      results: [{test: 'me'}]
    });

    await render(hbs`{{pagination-buttons
                        on-update-page=(action myAction)
                        total=total
                        page=page
                        perPage=per_page
                        results=results}}`);
    let $nextButton = this.element.querySelector('.PaginationButtons-next');

    assert.ok($nextButton);
  });

  test('NextPage button action', async function(assert) {
    const myAction = sinon.spy();
    this.setProperties({
      myAction: myAction,
      page: 1,
      per_page: 1,
      results: [{test: 'me'}, {test: 'me2'}, {test: 'me3'}]
    });

    await render(hbs`{{pagination-buttons
                        on-update-page=(action myAction)
                        page=page
                        perPage=per_page
                        results=results}}`);

    let $nextButton = this.element.querySelector('.PaginationButtons-next');
    $nextButton.click();

    assert.ok(myAction.calledWith(2));
  });

  test('FirstPage button action', async function(assert) {
    const myAction = sinon.spy();
    this.setProperties({
      myAction: myAction,
      page: 3,
      per_page: 1,
      results: [{test: 'me'}, {test: 'me2'}, {test: 'me3'}]
    });

    await render(hbs`{{pagination-buttons
                        on-update-page=(action myAction)
                        page=page
                        perPage=per_page
                        results=results}}`);

    let $firstButton = this.element.querySelector('.PaginationButtons-first');
    $firstButton.click();

    assert.ok(myAction.calledWith(1));
  });

  test('PrevPage button action', async function(assert) {
    const myAction = sinon.spy();
    this.setProperties({
      myAction: myAction,
      page: 3,
      per_page: 1,
      results: [{test: 'me'}, {test: 'me2'}, {test: 'me3'}]
    });

    await render(hbs`{{pagination-buttons
                        on-update-page=(action myAction)
                        page=page
                        perPage=per_page
                        results=results}}`);

    let $prevButton = this.element.querySelector('.PaginationButtons-prev');
    $prevButton.click();

    assert.ok(myAction.calledWith(2));
  });
});
