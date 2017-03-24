/* global document */

import wait from 'ember-test-helpers/wait';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('inline-edit', 'Integration | Component | inline edit', {
  integration: true
});

test('Displaying on render', function(assert) {
  this.set('value', 'RED');

  // Template block usage:
  this.render(hbs`
    {{#inline-edit display=value}}
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

test('Entering edit mode by clicking default button', function(assert) {
  this.setProperties({
    display: 'The band I am listening to',
    value: 'Matthew West'
  });

  // Template block usage:
  this.render(hbs`
    {{#inline-edit display=display}}
      <input type='text' value={{value}}>
    {{/inline-edit}}
  `);

  this.$('.InlineEdit-button--edit').trigger('click');

  return wait().then(()=> {
    assert.equal(
      this.$('input').val(),
      "Matthew West",
      'Clicking displays edit mode (block)'
    );
  });
});

test('Block display mode', function(assert) {
  this.render(hbs`
    {{#inline-edit as |ie|}}
      {{#if ie.isEditing}}
      {{else}}
        [DISPLAYING]
      {{/if}}
    {{/inline-edit}}
  `);

  assert.ok(
    this.$().text().indexOf('[DISPLAYING]') > -1
  );
});

test('Entering edit mode from block display mode, using provided button', function(assert) {
  this.render(hbs`
    {{#inline-edit as |ie|}}
      {{#if ie.isEditing}}
        [EDITMODE]
      {{else}}
        [DISPLAYMODE]
        {{ie.editButton class='edit-btn'}} 
      {{/if}}
    {{/inline-edit}}
  `);

  const $editBtn = this.$('.edit-btn');
  $editBtn.click();

  return wait().then(()=>{
    assert.equal(
      this.$().text().indexOf('[DISPLAYMODE]'), -1,
      "Display mode not visible"
    );

    assert.ok(
      this.$().text().indexOf('[EDITMODE]') > -1,
      "Edit mode visible"
    );
  });
});

test('Entering edit mode from block display mode, using provided action', function(assert) {
  this.render(hbs`
    {{#inline-edit as |ie|}}
      {{#if ie.isEditing}}
        [EDITMODE]
      {{else}}
        [DISPLAYMODE]
        <button class='edit-btn' {{action ie.enterEditMode}}>edit</button>
      {{/if}}
    {{/inline-edit}}
  `);

  this.$('.edit-btn').click();

  return wait().then(()=>{
    assert.equal(
      this.$().text().indexOf('[DISPLAYMODE]'), -1,
      "Display mode not visible"
    );

    assert.ok(
      this.$().text().indexOf('[EDITMODE]') > -1,
      "Edit mode visible"
    );
  });
});

test('Exiting edit mode from provided button', function(assert) {
  this.render(hbs`
    {{#inline-edit as |ie|}}
      {{#if ie.isEditing}}
        [EDITMODE]
        {{ie.okButton class='exit-btn'}}
      {{else}}
        [DISPLAYMODE]
        {{ie.editButton}}
      {{/if}}
    {{/inline-edit}}
  `);

  this.$('.InlineEdit-button--edit').click();

  return wait().then(()=>{
    //not in display mode
    assert.equal(
      this.$().text().indexOf('[DISPLAYMODE]'), -1
    );

    assert.ok(
      this.$().text().indexOf('[EDITMODE]') > -1);

    this.$('.exit-btn').click();

    return wait().then(()=>{
      //not in edit mode
      assert.equal(
        this.$().text().indexOf('[EDITMODE]'), -1
      );

      assert.ok(
        this.$().text().indexOf('[DISPLAYMODE]') > -1,
        "Display mode, after clicking ok button"
      );
    });
  });
});

test('Exiting edit mode from provided action', function(assert) {
  this.render(hbs`
    {{#inline-edit as |ie|}}
      {{#if ie.isEditing}}
        [EDITMODE]
        <button class='exit-btn' {{action ie.exitEditMode}}>ok</button>
      {{else}}
        [DISPLAYMODE]
        {{ie.editButton}}
      {{/if}}
    {{/inline-edit}}
  `);

  this.$('.InlineEdit-button--edit').click();

  return wait().then(()=>{
    //not in display mode
    assert.equal(
      this.$().text().indexOf('[DISPLAYMODE]'), -1
    );

    assert.ok(
      this.$().text().indexOf('[EDITMODE]') > -1);

    this.$('.exit-btn').click();

    return wait().then(()=>{
      //not in edit mode
      assert.equal(
        this.$().text().indexOf('[EDITMODE]'), -1
      );

      assert.ok(
        this.$().text().indexOf('[DISPLAYMODE]') > -1,
        "Display mode, after clicking ok button"
      );
    });
  });
});

test('didEnterEditMode action', function(assert) {
  const done = assert.async();
  this.set('handleEnterEditMode', function() {
    assert.ok(true, 'Entering edit mode triggers optional didEnterEditMode action');
    done();
  });

  this.render(hbs`
    {{#inline-edit display='DISPLAY' didEnterEditMode=(action handleEnterEditMode) as |ie|}}
      [EDITMODE]
    {{/inline-edit}}
  `);

  this.$('.InlineEdit-button--edit').click();
});

test('willExitEditMode action returning false', function(assert) {
  const done = assert.async();
  this.set('watchExitEditMode', function() {
    assert.ok(true, 'willExitEditMode was called');
    done();
    return false;
  });

  this.render(hbs`
    {{#inline-edit display='DISPLAY' willExitEditMode=(action watchExitEditMode) as |ie|}}
      [EDITMODE]
      {{ie.okButton}}
    {{/inline-edit}}
  `);

  this.$('.InlineEdit-button--edit').click();

  return wait().then(()=>{
    assert.ok(
      this.$().text().indexOf('[EDITMODE]') > -1
    );

    // In edit mode, now click ok button;
    this.$('.InlineEdit-button--ok').click();

    return wait().then(()=>{
      assert.ok(this.$().text().indexOf('[EDITMODE]') > -1,
        "When willExitEditMode returns false, it stays in edit mode"
      );
    });
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
    {{#inline-edit display=display isEditing=true didExitEditMode=(action didExitEditMode) focusChangesState=false as |f|}}
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
    {{#inline-edit display=display isEditing=true didExitEditMode=(action didExitEditMode) focusChangesState=false as |f|}}
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
