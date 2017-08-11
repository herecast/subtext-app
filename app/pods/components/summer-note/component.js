import Ember from 'ember';
import {sanitizeContent} from 'subtext-ui/lib/content-sanitizer';
import TestSelector from 'subtext-ui/mixins/components/test-selector';
import absorbPasteEvent from 'subtext-ui/utils/absorb-paste-event';

const {
  get, set,
  isPresent,
  inject,
  run,
  $
} = Ember;

const defaultToolbarOpts = [
  ['style', ['bold', 'italic', 'underline', 'clear']],
  ['insert', ['link']]
];

export default Ember.Component.extend(TestSelector, {
  classNames: ['wysiwyg-editor'],
  toolbar: defaultToolbarOpts,
  content: null,
  updateContent: false,
  imageMinHeight: 200,
  imageMinWidth: 200,

  showImageModal: false,
  $editor: null,

  notify: inject.service('notification-messages'),

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
      dialogsInBody: true,
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
          this._updateToggleStatus();
        },
        onKeyup: () => {
          run.debounce(this, this._updateToggleStatus, 100);
        },
        onFocus: () => {
          run.next(() => {
            this._updateToggleStatus();
          });
        },
        onPaste: (e) => {
          // Save the current location of the cursor in the editor
          const $editor = get(this, '$editor');
          $editor.summernote('saveRange');

          absorbPasteEvent(e.originalEvent).then(pastedContent => {

            // Restore cursor location
            $editor.summernote('restoreRange');

            // sanitize content
            const $div = Ember.$('<div />').append(
              sanitizeContent(pastedContent)
            );

            // Strip styles from images to prevent weird positioning and floating.
            $div.find('img[style]').removeAttr('style');

            // Remove wrapping <b> tag added by summernote for apparently no reason
            this.$('.note-editable > b').each(function() {
              let $bTag = Ember.$(this);
              if ($bTag.text() === '') {
                $bTag.contents().unwrap();
              }
            });

            const $children = $div.children();
            if ($children.length > 0) {
              // Append each child element to the current cursor location in summernote
              // Use insertNode instead of pasteHtml to avoid a bunch of bugs
              const self = this;
              $children.each(function() {
                const $childItem = $(this);
                if ($childItem.prop('tagName') === 'IMG') {
                  const imageUrl = $childItem.attr('src');
                  if (imageUrl) {
                    self.insertImage(imageUrl);
                  }
                } else {
                  $editor.summernote('insertNode', this);
                }
              });
            } else {
              $editor.summernote('insertText', $div.text());
            }

            this.send('doUpdate');
            this._updateToggleStatus();
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
      this.setEditorContent(content);
    }

    // Remove tooltips in button bar if mobile to avoid double click
    if (get(this, 'media.isMobile')) {
      this.$('.note-toolbar button').each(function() {
        Ember.$(this).removeAttr('title');
        Ember.$(this).removeAttr('data-original-title');
      });
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
        template: function(item) {

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
          const tagName = Ember.$(e.target).prop('tagName');
          $editor.summernote('formatBlock', tagName);
        }
      })
    ]).render();
  },

  setEditorContent(content) {
    $('.note-editable').html(content);
  },

  getEditorContent() {
    return $('.note-editable').html();
  },

  clearEditorContent() {
    this.setEditorContent('');
  },

  _updateToggleStatus() {
    const $editor = get(this, '$editor');
    const range = $editor.summernote('createRange');
    const $activeDomNodes = $(range.nodes());

    // Toggle the state of the Ordered List button
    const $orderedListButton = $('.note-toolbar [data-original-title~="Ordered"]');
    if ($activeDomNodes.closest('.note-editor ol').length) {
      $orderedListButton.addClass('active');
    } else {
      $orderedListButton.removeClass('active');
    }

    // Toggle the state of the Unordered List button
    const $unorderedListButton = $('.note-toolbar [data-original-title~="Unordered"]');
    if ($activeDomNodes.closest('.note-editor ul').length) {
      $unorderedListButton.addClass('active');
    } else {
      $unorderedListButton.removeClass('active');
    }
  },

  didUpdateAttrs(attrs) {
    this._super(...arguments);

    // Only update the editor with new content if updateContent flag is set
    // This avoids a bug where the cursor jumps when the user types
    const updateContent = get(attrs, 'newAttrs.updateContent.value');

    if (updateContent) {
      this.setEditorContent(get(attrs, 'newAttrs.content'));
      set(this, 'updateContent', false);
    }
  },

  /**
   * Save the current location of the cursor, so it can be restored later.
   */
  saveCursorLocation() {
    const $editor = get(this, '$editor');
    $editor.summernote('saveRange');
  },

  /**
   * Restore the saved location of the cursor
   */
  restoreCursorLocation() {
    const $editor = get(this, '$editor');
    $editor.summernote('restoreRange');
  },

  /**
   * Get DOM node of cursor's current location
   * @returns {jQuery|HTMLElement}
   */
  getActiveDomNode() {
    const $editor = get(this, '$editor');
    const range = $editor.summernote('createRange');

    return $(range.nodes());
  },

  insertImage(imageUrl, caption='') {
    // Special handling if we're inside of a list item
    const $activeDomNode = this.getActiveDomNode();
    const parentListItem = $activeDomNode.closest('.note-editor ol li, .note-editor ul li');
    if (parentListItem.length) {

      // Remove hanging <br /> tag in current location
      const activeContent = $activeDomNode.html();
      if (activeContent === '<br>' || activeContent === '<br/>') {
        $activeDomNode.html('');
      }

      // Determine if we're inside the last item in a list so we can insert a new list item
      // Otherwise, the user will have trouble adding a new list item on their own
      if (parentListItem.is(':last-child')) {
        parentListItem.parent().append('<li><br/></li>');
      }
    }

    // Insert the image
    const $editor = get(this, '$editor');
    const $image = $(`<img src="${imageUrl}" /> class="ContentImage-image"`);
    $editor.summernote('insertNode', $image[0]);

    // Insert the caption
    // We cannot use 'insertNode' because summernote will break lists when you insert a block level element
    // and if you use a span, the next list item created will be copied from that value, so this hack is necessary
    const $captionParagraph = $(`<p class="ContentImage-caption">${caption}</p>`);
    $activeDomNode.append($captionParagraph[0]);

    this.send('doUpdate');
  },

  actions: {
    doUpdate() {
      const content = this.$('.note-editable').html();

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
      caption = caption || '<br />';

      const uploadImage = get(this, 'uploadImage');
      uploadImage(selectedImage).then(({image}) => {
        this.restoreCursorLocation();
        this.insertImage(image.url, caption);
      });

      set(this, 'showImageModal', false);
      this.send('doUpdate');
    }
  }
});
