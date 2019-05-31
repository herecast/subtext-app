import { get, set } from '@ember/object';
import { alias, empty } from '@ember/object/computed';
import { next } from '@ember/runloop';
import $ from 'jquery';
import { htmlSafe } from '@ember/string';
import JobsForms from 'subtext-ui/mixins/components/jobs-forms';
import Component from '@ember/component';

export default Component.extend(JobsForms, {
  classNames: ['JobsForms-Title'],
  classNameBindings: ['titleIsEmpty:empty'],

  model: null,
  maxlength: 120,

  titleStyle: null,

  onChange: function() {},

  title: alias('model.title'),
  titleIsEmpty: empty('title'),

  didInsertElement() {
    this._super(...arguments);
    this._setTitleStyle();
  },

  _setTitleStyle() {
    let cloneHeight = $(get(this, 'element')).find('#title-clone').height();
    cloneHeight = cloneHeight > 26 ? cloneHeight : 26;

    set(this, 'titleStyle', htmlSafe(`height:${cloneHeight}px;`));
  },

  actions: {
    titleChanging(textareaEvent) {
      next(() => {
        if (this._notEnterKeys(textareaEvent)) {
          const title = get(this, 'title');
          let sanitizedTitle = this._sanitizeOutHtml(title);
          sanitizedTitle = this._truncateValue(sanitizedTitle, get(this, 'maxlength'));

          set(this, 'title', sanitizedTitle);
          this._setTitleStyle();

          this.onChange(sanitizedTitle);
        }
      });
    }
  }
});
