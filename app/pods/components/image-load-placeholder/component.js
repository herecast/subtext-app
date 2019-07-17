import { htmlSafe } from '@ember/template';
import Component from '@ember/component';
import { next, later } from '@ember/runloop';
import { computed, get, set } from '@ember/object';
import { alias } from '@ember/object/computed';
import { Promise } from 'rsvp';
import $ from 'jquery';
import { inject as service } from '@ember/service';

export default Component.extend({
  fastboot: service(),
  classNames: 'ImageLoadPlaceholder',
  'data-test-loading-image-url': alias('imageUrl'),

  currentController: service(),

  placeholderBlockWidth: null,
  placeholderBlockHeight: null,
  placeholderBlockFixedSize: false,

  placeholderClass: null,
  placeholderImageClass: null,

  imageUrl: null,
  placeholderUrl: null,
  formerImageUrl: null,

  imageIsLoaded: false,
  blurIsLoaded: false,
  showGradient: false,
  revealYield: false,

  didReceiveAttrs() {
    this._super(...arguments);

    const isFastBoot = get(this, 'fastboot.isFastBoot');

    if (!isFastBoot) {
      const placeholderUrl = get(this,'placeholderUrl');
      const imageUrl = get(this, 'imageUrl');
      const formerImageUrl = get(this, 'formerImageUrl');

      if (placeholderUrl) {
        this.loadImage(placeholderUrl).then(() => {
          if ( !get(this, 'isDestroyed') && !get(this, 'isDestroying') ) {
            set(this, 'blurIsLoaded', true);

            this._showYieldIfImageIsLoaded();
          }
        });
      }

      if (imageUrl && imageUrl !== formerImageUrl) {
        set(this, 'formerImageUrl', imageUrl);
        this.loadImage(imageUrl)
        .then(() => {
          if ( !get(this, 'isDestroyed') && !get(this, 'isDestroying') ) {
            set(this, 'imageIsLoaded', true);

            const onImageLoadedAction = get(this, 'onImageLoaded');

            if(onImageLoadedAction) {
              onImageLoadedAction();
            }
          }
        });
      }
    }
  },

  _showYieldIfImageIsLoaded() {
    if (get(this, 'imageIsLoaded')) {
      later(() => {
        set(this, 'revealYield', true);
      }, 200);
    } else {
      later(this, '_showYieldIfImageIsLoaded', 200);
    }
  },

  loadImage(url) {
    return new Promise((resolve, reject) => {
      let image = new Image();

      image.onload = () => {
        next( () => resolve() );
      };

      image.onerror = () => {
        next( () => reject() );
      };

      image.src = url;
    });
  },

  boundaryStyle: computed('placeholderBlockFixedSize', 'placeholderBlockWidth', 'placeholderBlockHeight', function() {
    const placeholderBlockWidth = parseInt(get(this, 'placeholderBlockWidth'));
    const placeholderBlockHeight = parseInt(get(this, 'placeholderBlockHeight'));
    const placeholderBlockFixedSize = get(this, 'placeholderBlockFixedSize');

    if (placeholderBlockFixedSize) {
      return htmlSafe(`height:${placeholderBlockHeight}px;width:${placeholderBlockWidth}px;`);
    }

    const aspectRatio = placeholderBlockHeight / placeholderBlockWidth;
    const elementWidth = $(this.element).width();
    const heightToSet = parseInt(aspectRatio * elementWidth);

    return htmlSafe(`height:${heightToSet}px;`);
  })
});
