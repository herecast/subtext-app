/* global document */

import wait from 'ember-test-helpers/wait';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('inline-edit', 'Integration | Component | inline edit', {
  integration: true
});

test('Displaying value on render', function(assert) {
  this.set('value', 'RED');

  // Template block usage:
  this.render(hbs`
    {{#inline-edit value=value}}
      {EDIT MODE}
    {{/inline-edit}}
  `);

    assert.ok(
      this.$().text().indexOf('RED') > -1
    );

    assert.ok(
      this.$().text().indexOf('{EDIT MODE}') === -1
    );
});

test('Entering edit mode by click, exiting edit mode by focusout', function(assert) {
  this.setProperties({
    display: 'The band I am listening to',
    value: 'Matthew West'
  });

  // Template block usage:
  this.render(hbs`
    {{#inline-edit value=display}}
      <input type='text' value={{value}}>
    {{/inline-edit}}
  `);

  this.$('.InlineEdit-display').trigger('click');

  return wait().then(()=> {
    assert.equal(
      this.$('input').val(),
      "Matthew West",
      'Clicking displays edit mode (block)'
    );
    /**
     * @TODO: not working
    assert.ok(
      this.$('input:focus').length > 0,
      "The input is given focus"
    );
    */

    this.$('input').trigger('focusout');
    return wait().then(()=>{
      assert.ok(
        this.$().text().indexOf('The band I am listening to') > -1,
        "focusout causes to leave edit mode"
      );
    });
  });
});

test('Entering edit mode by click, exiting edit mode by button action', function(assert) {
  this.setProperties({
    display: 'The band I am listening to',
    value: 'Matthew West'
  });

  // Template block usage:
  this.render(hbs`
    {{#inline-edit value=display focusChangesState=false as |f|}}
      <input type='text' value=value>
      <button onclick={{action f.exitEditMode}}>Done Editing</button>
    {{/inline-edit}}
  `);

  this.$('.InlineEdit-display').click();
  assert.ok(this.$('input').length > 0, "In edit mode");

  this.$('button').click();

  return wait().then(()=> {
    assert.ok(
      this.$().text().indexOf('The band I am listening to') > -1,
      "triggring action causes to leave edit mode"
    );
  });
});

test('didExitEditMode action', function(assert) {
  const done = assert.async();

  this.setProperties({
    display: 'The band I am listening to',
    value: 'Matthew West',
    didExitEditMode() {
      assert.ok(true, "didExitEditMode triggered when leaving edit mode");
      done();
    }
  });

  // Template block usage:
  this.render(hbs`
    {{#inline-edit value=display isEditing=true didExitEditMode=(action didExitEditMode) focusChangesState=false as |f|}}
      <input type='text' value=value>
      <button onclick={{action f.exitEditMode}}>Done Editing</button>
    {{/inline-edit}}
  `);

  this.$('button').click();
});

test('enter key from input', function(assert) {
  assert.expect(2);

  let enterBubbled = false;

  this.setProperties({
    display: '',
    value: '',
    didExitEditMode() {
      assert.ok(true, "Pressing Enter exits edit mode.");
    }
  });

  this.render(hbs`
    {{#inline-edit value=display isEditing=true didExitEditMode=(action didExitEditMode) focusChangesState=false as |f|}}
      <input type='text' value=value>
    {{/inline-edit}}
  `);

    this.$(document).one('keypress', function(e) {
      if(e.keyCode === 13) {
        enterBubbled = true;
        assert.notOk(true, 'submit was called!');
      }
    });

    const $input = this.$('.InlineEdit input');
    $input.focus();
    $input.trigger({
      type: 'keypress',
      which: 13,
      keyCode: 13
    });

    return wait().then(()=> {
      assert.notOk(enterBubbled, "The Enter event did not bubble.");
    });
});
