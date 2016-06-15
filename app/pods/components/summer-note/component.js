/*global jQuery*/

import Ember from 'ember';
import { sanitizeContent } from 'subtext-ui/lib/content-sanitizer';

const {
  run,
  get, set,
  isPresent,
  inject
} = Ember;

const defaultToolbarOpts = [
  ['style', ['bold', 'italic', 'underline', 'clear']],
  ['insert', ['link']]
];

export default Ember.Component.extend({
  classNames: ['wysiwyg-editor'],
  toolbar: defaultToolbarOpts,
  content: null,
  updateContent: false,
  imageMinHeight: 200,
  imageMinWidth: 200,

  showImageModal: false,
  $editor: null,

  toast: inject.service(),

  willDestroyElement() {
    this.$('textarea').summernote('destroy');
  },

  didInsertElement() {
    const toolbar = get(this, 'toolbar');
    const content = get(this, 'content');
    const $editor = this.$('textarea');
    set(this, '$editor', $editor);

    let summerNoteConfig = {
      // DO NOT set height.  It causes all kinds of issues
      // with summernote's absolute positioned overlays.
      //height: height,
      styleWithSpan: false,
      toolbar: toolbar,
      styleTags: [
        {tag: 'p', title: 'Normal'},
        {tag: 'h2', title: 'Heading'},
        {tag: 'h3', title: 'Sub Heading'},
        {tag: 'blockquote', title: 'Quote'}
      ],

      callbacks: {
        onChange: () => {
          // must use onChange and not keyUp
          // (for video embeds)
          this.send('doUpdate');
        },
        onPaste: (e) => {
          e.preventDefault();

          let buffer = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('text/html');

          // Replace bold-but-not-bold element with span
          buffer = buffer.replace(/<b style="font-weight:normal;"/g, '<span');

          const div = document.createElement('div');
          div.innerHTML = buffer;

          run.later(() => {
            const cleanNodes = sanitizeContent(div);
            const $div = jQuery('<div>').append(cleanNodes);
            // Strip styles from images to prevent weird positioning and floating.
            $div.find('img[style]').removeAttr('style');

            const cleanHtml = $div.html();

            $editor.summernote('pasteHTML', cleanHtml);

            // SummerNote likes to add a <p><br></p> when pasting multi-line content
            // This causes the spacing to expand, which is undesirable
            // So clear it out, but only change the editor contents if necessary
            // as this could screw up the cursor position
            const editorContent = this.$('.note-editable').html();
            let newContent = editorContent.replace(/<p><br><\/p>/g, '');
            if (editorContent !== newContent) {
              this._setEditorContent(newContent);
            }

            this.send('doUpdate');
          });
        }
      },
      onCreateLink: (url) => {
        url = url.trim();
        var protocol = /^[a-z]+:/i;

        if (!protocol.test(url)) {
          url = 'http://' + url;
        }

        return url;
      }
    };

    summerNoteConfig.buttons = this._getButtons();

    if (isPresent(this.attrs.modules)) {
      summerNoteConfig.modules = this.attrs.modules.value;
    }

    if (isPresent(this.attrs.popover)) {
      summerNoteConfig.popover = this.attrs.popover.value;
    }

    $editor.summernote(summerNoteConfig);

    if (content) {
      // Initialize editor with content
      this._setEditorContent(content);
    }
  },

  _getButtons() {
    const ui = Ember.$.summernote.ui;
    const buttonsParam = get(this, 'buttons');
    const $editor = get(this, '$editor');

    return Ember.$.extend({}, {
      subtextFloatLeft: ui.button({
        contents: '<i class="fa fa-align-left"/>',
        tooltip: 'Float Left',
        click(e) {
          e.preventDefault();
          ($editor.summernote('wrapCommand', function() {
            Ember.$($editor.summernote('restoreTarget'))
              .parent()
              .addClass('pull-left')
              .removeClass('pull-right');
          }))();
        }
      }).render(),
      subtextFloatRight: ui.button({
        contents: '<i class="fa fa-align-right"/>',
        tooltip: 'Float Right',
        click(e) {
          e.preventDefault();
          ($editor.summernote('wrapCommand', function() {
            Ember.$($editor.summernote('restoreTarget'))
              .parent()
              .addClass('pull-right')
              .removeClass('pull-left');
          }))();
        }
      }).render(),
      subtextFloatNone: ui.button({
        contents: '<i class="fa fa-align-justify"/>',
        tooltip: 'Center Image',
        click(e) {
          e.preventDefault();
          ($editor.summernote('wrapCommand', function() {
            Ember.$($editor.summernote('restoreTarget'))
              .parent()
              .removeClass('pull-left pull-right');
          }))();
        }
      }).render(),
      subtextRemoveMedia: ui.button({
        contents: '<i class="fa fa-trash"/>',
        tooltip: 'Remove Image',
        click(e) {
          e.preventDefault();
          ($editor.summernote('wrapCommand', function() {
            Ember.$($editor.summernote('restoreTarget'))
              .parent()
              .remove();
          }))();
        }
      }).render(),
      subtextImageSize100: ui.button({
        contents: '<span class="note-fontsize-10">100%</span>',
        tooltip: 'Resize Full',
        click(e) {
          e.preventDefault();
          ($editor.summernote('wrapCommand', function() {
            Ember.$($editor.summernote('restoreTarget'))
              .css({width: 'auto', height: 'auto'})
              .parent()
              .removeClass('width25 width50');
          }))();
        }
      }).render(),
      subtextImageSize50: ui.button({
        contents: '<span class="note-fontsize-10">50%</span>',
        tooltip: 'Resize Half',
        click(e) {
          e.preventDefault();
          ($editor.summernote('wrapCommand', function() {
            Ember.$($editor.summernote('restoreTarget'))
              .css({width: 'auto', height: 'auto'})
              .parent()
              .addClass('width50')
              .removeClass('width25');
          }))();
        }
      }).render(),
      subtextImageSize25: ui.button({
        contents: '<span class="note-fontsize-10">25%</span>',
        tooltip: 'Resize Quarter',
        click(e) {
          e.preventDefault();
          ($editor.summernote('wrapCommand', function() {
            Ember.$($editor.summernote('restoreTarget'))
              .css({width: 'auto', height: 'auto'})
              .parent()
              .addClass('width25')
              .removeClass('width50');
          }))();
        }
      }).render(),
      subtextImageModal: this._getSubtextImageButton(),
      subtextStyleButtonMenu: this._getSubtextStyleButtonMenu()
    }, buttonsParam);
  },

  _getSubtextImageButton() {
    const ui = Ember.$.summernote.ui;
    const self = this;

    // create button
    const button = ui.button({
      contents: '<i class="fa fa-picture-o"/>',
      tooltip: 'Picture',
      click() {
        set(self, 'showImageModal', true);
      }
    });

    return button.render();
  },

  _getSubtextStyleButtonMenu() {
    const ui = Ember.$.summernote.ui;
    const $editor = get(this, '$editor');

    return ui.buttonGroup([
      ui.button({
        className: 'dropdown-toggle',
        contents: '<i class="fa fa-magic"></i> <span class="caret"></span>',
        tooltip: 'Style',
        data: {
          toggle: 'dropdown'
        }
      }),
      ui.dropdown({
        className: 'dropdown-style',
        items: [
          {tag: 'p', title: 'Normal'},
          {tag: 'h2', title: 'Heading'},
          {tag: 'h3', title: 'Sub Heading'},
          {tag: 'blockquote', title: 'Quote'}
        ],
        template: function (item) {

          if (typeof item === 'string') {
            item = { tag: item, title: item };
          }

          var tag = item.tag;
          var title = item.title;
          var style = item.style ? ' style="' + item.style + '" ' : '';
          var className = item.className ? ' className="' + item.className + '"' : '';

          return '<' + tag + style + className + '>' + title + '</' + tag +  '>';
        },
        click(e) {
          e.preventDefault();
          const tagName = Ember.$(e.target).prop('tagName');
          $editor.summernote('formatBlock', tagName);
        }
      })
    ]).render();
  },

  _setEditorContent(content) {
    Ember.$('.note-editable').html(content);
  },

  didUpdateAttrs(attrs) {
    this._super(...arguments);

    // Only update the editor with new content if updateContent flag is set
    // This avoids a bug where the cursor jumps when the user types
    const updateContent = get(attrs, 'newAttrs.updateContent.value');

    if (updateContent) {
      this._setEditorContent(get(attrs, 'newAttrs.content'));
      set(this, 'updateContent', false);
    }
  },

  actions: {
    doUpdate() {
      const content = this.$('.note-editable').html();

      // Notify new content
      if ('notifyChange' in this.attrs) {
        this.attrs.notifyChange(content);
      }
    },

    cancelImageModal() {
      set(this, 'showImageModal', false);
    },

    saveImageModal(selectedImage, caption) {
      caption = caption || '';

      this.attrs.uploadImage(selectedImage).then(({image}) => {
        let $imageWrapper = Ember.$('<div class="ContentImage"></div>');
        $imageWrapper.append(`<img src="${image.url}" />`);
        $imageWrapper.append(`<p>${caption}</p>`);

        const $editor = get(this, '$editor');
        $editor.summernote('insertParagraph');
        $editor.summernote('insertNode', $imageWrapper[0]);
      });

      set(this, 'showImageModal', false);
    }
  }
});
