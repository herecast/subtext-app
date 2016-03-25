import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
/* global sinon */

moduleForComponent('pagination-buttons', 'Integration | Component | pagination buttons', {
  integration: true
});


test('Previous button not visible on page 1', function(assert) {
  this.setProperties({
    myAction: function() {},
    page: 1,
    per_page: 1,
    results: [{test: 'me'}, {test: 'me2'}]
  });

  this.render(hbs`{{pagination-buttons
                      on-update-page=(action myAction)
                      page=page
                      perPage=per_page
                      results=results}}`);
  let $prevButton = this.$('.PaginationButtons-prev');

  assert.equal($prevButton.length, 0);
});

test('Previous button visible on page 2', function(assert) {
  this.setProperties({
    myAction: function() {},
    page: 2,
    per_page: 1,
    results: [{test: 'me'}, {test: 'me2'}]
  });

  this.render(hbs`{{pagination-buttons
                      on-update-page=(action myAction)
                      page=page
                      perPage=per_page
                      results=results}}`);
  let $prevButton = this.$('.PaginationButtons-prev');

  assert.equal($prevButton.length, 1);
});

test('FirstPage button not visible on page 1', function(assert) {
  this.setProperties({
    myAction: function() {},
    page: 1,
    per_page: 1,
    results: [{test: 'me'}, {test: 'me2'}]
  });

  this.render(hbs`{{pagination-buttons
                      on-update-page=(action myAction)
                      page=page
                      perPage=per_page
                      results=results}}`);
  let $firstButton = this.$('.PaginationButtons-first');

  assert.equal($firstButton.length, 0);
});

test('FirstPage button visible on page 2', function(assert) {
  this.setProperties({
    myAction: function() {},
    page: 2,
    per_page: 1,
    results: [{test: 'me'}, {test: 'me2'}]
  });

  this.render(hbs`{{pagination-buttons
                      on-update-page=(action myAction)
                      page=page
                      perPage=per_page
                      results=results}}`);
  let $firstButton = this.$('.PaginationButtons-first');

  assert.equal($firstButton.length, 1);
});

test('NextPage button not visible when results < per_page', function(assert) {
  this.setProperties({
    myAction: function() {},
    page: 1,
    per_page: 3,
    results: [{test: 'me'}, {test: 'me2'}]
  });

  this.render(hbs`{{pagination-buttons
                      on-update-page=(action myAction)
                      page=page
                      perPage=per_page
                      results=results}}`);
  let $nextButton = this.$('.PaginationButtons-next');

  assert.equal($nextButton.length, 0);
});

test('Given no total parameter; NextPage button visible when results >= per_page', function(assert) {
  this.setProperties({
    myAction: function() {},
    page: 2,
    per_page: 1,
    results: [{test: 'me'}, {test: 'me2'}]
  });

  this.render(hbs`{{pagination-buttons
                      on-update-page=(action myAction)
                      page=page
                      perPage=per_page
                      results=results}}`);
  let $nextButton = this.$('.PaginationButtons-next');

  assert.equal($nextButton.length, 1);
});

test('Given a total parameter; NextPage button visible when page * per_page < total', function(assert) {
  this.setProperties({
    myAction: function() {},
    total: 5,
    page: 2,
    per_page: 2,
    results: [{test: 'me'}]
  });

  this.render(hbs`{{pagination-buttons
                      on-update-page=(action myAction)
                      total=total
                      page=page
                      perPage=per_page
                      results=results}}`);
  let $nextButton = this.$('.PaginationButtons-next');

  assert.equal($nextButton.length, 1);
});

test('Given a total parameter; NextPage button not visible when page * per_page = total and per_page == results', function(assert) {
  this.setProperties({
    myAction: function() {},
    total: 3,
    page: 2,
    per_page: 1,
    results: [{test: 'me'}]
  });

  this.render(hbs`{{pagination-buttons
                      on-update-page=(action myAction)
                      total=total
                      page=page
                      perPage=per_page
                      results=results}}`);
  let $nextButton = this.$('.PaginationButtons-next');

  assert.equal($nextButton.length, 1);
});

test('NextPage button action', function(assert) {
  const myAction = sinon.spy();
  this.setProperties({
    myAction: myAction,
    page: 1,
    per_page: 1,
    results: [{test: 'me'}, {test: 'me2'}, {test: 'me3'}]
  });

  this.render(hbs`{{pagination-buttons
                      on-update-page=(action myAction)
                      page=page
                      perPage=per_page
                      results=results}}`);

  let $nextButton = this.$('.PaginationButtons-next');
  $nextButton.click();

  assert.ok(myAction.calledWith(2));
});

test('FirstPage button action', function(assert) {
  const myAction = sinon.spy();
  this.setProperties({
    myAction: myAction,
    page: 3,
    per_page: 1,
    results: [{test: 'me'}, {test: 'me2'}, {test: 'me3'}]
  });

  this.render(hbs`{{pagination-buttons
                      on-update-page=(action myAction)
                      page=page
                      perPage=per_page
                      results=results}}`);

  let $firstButton = this.$('.PaginationButtons-first');
  $firstButton.click();

  assert.ok(myAction.calledWith(1));
});

test('PrevPage button action', function(assert) {
  const myAction = sinon.spy();
  this.setProperties({
    myAction: myAction,
    page: 3,
    per_page: 1,
    results: [{test: 'me'}, {test: 'me2'}, {test: 'me3'}]
  });

  this.render(hbs`{{pagination-buttons
                      on-update-page=(action myAction)
                      page=page
                      perPage=per_page
                      results=results}}`);

  let $prevButton = this.$('.PaginationButtons-prev');
  $prevButton.click();

  assert.ok(myAction.calledWith(2));
});
