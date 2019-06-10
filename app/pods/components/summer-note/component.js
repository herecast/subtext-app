import { inject as service } from '@ember/service';
import $ from 'jquery';
import { set, get } from '@ember/object';
import { isPresent } from '@ember/utils';
import { run } from '@ember/runloop';
import { sanitizeContent } from 'subtext-app/lib/content-sanitizer';
import TestSelector from 'subtext-app/mixins/components/test-selector';
import Component from '@ember/component';

const defaultToolbarOpts = [
  ['style', ['bold', 'italic', 'underline', 'clear']],
  ['insert', ['link']]
];

export default Component.extend(TestSelector, {
  classNames: ['wysiwyg-editor'],
  toolbar: defaultToolbarOpts,
  content: null,
  updateContent: false,
  imageMinHeight: 200,
  imageMinWidth: 200,

  showImageModal: false,
  $editor: null,

  notify: service('notification-messages'),

  willDestroyElement() {
    $(this.element).find('textarea').summernote('destroy');
  },

  didInsertElement() {
    const toolbar = get(this, 'toolbar');
    const content = get(this, 'content');
    const $editor = $(this.element).find('textarea');
    set(this, '$editor', $editor);

    let summerNoteConfig = {
      // DO NOT set height.  It causes all kinds of issues
      // with summernote's absolute positioned overlays.
      //height: height,
      dialogsInBody: true,
      styleWithSpan: false,
      toolbar: toolbar,
      disableDragAndDrop: true,
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
        onPaste: () => {
          // DO NOT stop the paste event from bubbling or attempt to interfere with it using the clipboard API!!
          // Doing so is highly inconsistent across browsers and has led to multiple bugs.
          // Instead, redirect the browser's focus into a separate contenteditable div and allow the browser
          // to paste the content as-is. Then, we pull the content out, sanitize it and add it into summernote.

          // Save the current location of the cursor in the editor
          const $editor = get(this, '$editor');
          $editor.summernote('saveRange');

          // Redirect paste event to our own contenteditable div
          const $pasteTarget = $('<div contenteditable="true" />')
            .css({
              position: "absolute",
              opacity: 0
            })
            .insertAfter($editor)
            .focus();

          run.later(() => {
            // Restore cursor location
            $editor.summernote('restoreRange');

            // sanitize content, remove contentediable div
            const $div = $('<div />').append(sanitizeContent($pasteTarget));
            $pasteTarget.remove();

            // Strip styles from images to prevent weird positioning and floating.
            $div.find('img[style]').removeAttr('style');

            // Remove wrapping <b> tag added by summernote for apparently no reason
            $(this.element).find('.note-editable > b').each(function () {
              let $bTag = $(this);
              if ($bTag.text() === '') {
                $bTag.contents().unwrap();
              }
            });

            const $children = $div.children();
            if ($children.length > 0) {
              // Append each child element to the current cursor location in summernote
              // Use insertNode instead of pasteHtml to aviod a bunch of bugs
              $children.each(function () {
                $editor.summernote('insertNode', this);
              });
            } else {
              $editor.summernote('insertText', $div.text());
            }

            this.send('doUpdate');
          }, 50);

          return false;
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

    const modules = get(this, 'modules');
    if (isPresent(modules)) {
      summerNoteConfig.modules = modules;
    }

    const popover = get(this, 'popover');
    if (isPresent(popover)) {
      summerNoteConfig.popover = popover;
    }

    $editor.summernote(summerNoteConfig);

    if (content) {
      // Initialize editor with content
      this._setEditorContent(content);
    }

    // Remove tooltips in button bar if mobile to avoid double click
    if (get(this, 'media.isMobile')) {
        $(this.element).find('.note-toolbar button').each(function () {
        $(this.element).removeAttr('title');
        $(this.element).removeAttr('data-original-title');
      });
    }
  },

  _getButtons() {
    const ui = $.summernote.ui;
    const buttonsParam = get(this, 'buttons');
    const $editor = get(this, '$editor');

    return $.extend({}, {
      subtextFloatLeft: ui.button({
        contents: '<i class="fa fa-align-left"/>',
        tooltip: 'Float Left',
        click(e) {
          e.preventDefault();
          ($editor.summernote('wrapCommand', function () {
            $($editor.summernote('restoreTarget'))
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
          ($editor.summernote('wrapCommand', function () {
            $($editor.summernote('restoreTarget'))
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
          ($editor.summernote('wrapCommand', function () {
            $($editor.summernote('restoreTarget'))
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
          ($editor.summernote('wrapCommand', function () {
            $($editor.summernote('restoreTarget'))
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
          ($editor.summernote('wrapCommand', function () {
            $($editor.summernote('restoreTarget'))
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
          ($editor.summernote('wrapCommand', function () {
            $($editor.summernote('restoreTarget'))
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
          ($editor.summernote('wrapCommand', function () {
            $($editor.summernote('restoreTarget'))
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
    const ui = $.summernote.ui;
    const self = this;
    const $editor = get(this, '$editor');

    // create button
    const button = ui.button({
      contents: '<i class="fa fa-picture-o"/>',
      tooltip: 'Picture',
      click() {
        $editor.summernote('saveRange');
        set(self, 'showImageModal', true);
        //remove focus from main element to kill ios keyboard
        let $editBox = self.$('.note-editor');
        $editBox.find('[class^="note-"]').blur();
      }
    });

    return button.render();
  },

  _getSubtextStyleButtonMenu() {
    const ui = $.summernote.ui;
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
            item = {tag: item, title: item};
          }

          var tag = item.tag;
          var title = item.title;
          var style = item.style ? ' style="' + item.style + '" ' : '';
          var className = item.className ? ' className="' + item.className + '"' : '';

          return '<' + tag + style + className + '>' + title + '</' + tag + '>';
        },
        click(e) {
          e.preventDefault();
          const tagName = $(e.target).prop('tagName');
          $editor.summernote('formatBlock', tagName);
        }
      })
    ]).render();
  },

  _setEditorContent(content) {
    $('.note-editable').html(content);
  },

  didUpdateAttrs() {
    this._super(...arguments);
    // Only update the editor with new content if updateContent flag is set
    // This avoids a bug where the cursor jumps when the user types
    if (get(this, 'updateContent')) {
      this._setEditorContent(get(this, 'content'));
      set(this, 'updateContent', false);
    }
  },

  _sanitizeContentImages() {
    const $content = $(this.element).find('.note-editable');
    const divsWithContentImageClass = $content.find('.ContentImage');

    if (divsWithContentImageClass.length) {
      divsWithContentImageClass.each((index, div) => {
        let divIsWithoutImage = $(div).find('img').length === 0;
        if (divIsWithoutImage) {
          $(div).removeAttr('class');
        }
      });
    }
    return $content.html();
  },

  actions: {
    doUpdate() {
      const content = this._sanitizeContentImages();

      // Notify new content
      const notifyChange = get(this, 'notifyChange');
      if (notifyChange) {
        notifyChange(content);
      }
    },

    cancelImageModal() {
      set(this, 'showImageModal', false);
    },

    saveImageModal(selectedImage, caption) {
      caption = caption || '';

      const uploadImage = get(this, 'uploadImage');
      uploadImage(selectedImage).then(({image}) => {
        let $imageWrapper = $('<div class="ContentImage"></div>');
        $imageWrapper.append(`<img src="${image.url}" />`);
        $imageWrapper.append(`<p>${caption}</p>`);

        const $editor = get(this, '$editor');
        $editor.summernote('restoreRange');
        $editor.summernote('insertNode', $imageWrapper[0]);
      });

      set(this, 'showImageModal', false);
    }
  }
});
