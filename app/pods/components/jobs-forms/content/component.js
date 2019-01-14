import { get, set } from '@ember/object';
import { alias, empty } from '@ember/object/computed';
import $ from 'jquery';
import { htmlSafe } from '@ember/string';
import { next } from '@ember/runloop';
import JobsForms from 'subtext-ui/mixins/components/jobs-forms';
import Component from '@ember/component';

export default Component.extend(JobsForms, {
  classNames: ['JobsForms-Content'],
  classNameBindings: ['contentIsEmpty:empty'],

  model: null,
  maxlength: 1000,

  contentStyle: null,

  onChange: function() {},

  content: alias('model.content'),
  contentIsEmpty: empty('content'),

  didInsertElement() {
    this._super(...arguments);
    this._setContentStyle();
  },

  _setContentStyle() {
    let cloneHeight = $(get(this, 'element')).find('#content-clone').height();
    cloneHeight = cloneHeight > 26 ? cloneHeight : 26;

    set(this, 'contentStyle', htmlSafe(`height:${cloneHeight}px;`));
  },

  _contentChanged() {
    const content = get(this, 'model.content');
    let sanitizedContent = this._sanitizeOutHtml(content, true);
    sanitizedContent = this._truncateValue(sanitizedContent, get(this, 'maxlength'));

    set(this, 'model.content', sanitizedContent);
    this._setContentStyle();

    this.onChange(sanitizedContent);
  },

  actions: {
    contentChanging() {
      this._contentChanged();
    },

    onPaste() {
      next(() => {
        this._contentChanged();
      });
    }
  }
});
