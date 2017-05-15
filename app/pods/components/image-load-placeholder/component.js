import Ember from 'ember';

const {set, get, run, computed, RSVP:{Promise}, inject:{service}} = Ember;

export default Ember.Component.extend({
  fastboot: service(),
  classNames: 'ImageLoadPlaceholder',

  currentController: service(),

  placeholderBlockWidth: null,
  placeholderBlockHeight: null,
  placeholderBlockFixedSize: false,

  placeholderClass: null,
  placeholderImageClass: null,

  imageUrl: null,
  placeholderUrl: null,

  imageIsLoaded: false,
  blurIsLoaded: false,

  didReceiveAttrs() {
    this._super(...arguments);

    const isFastBoot = get(this, 'fastboot.isFastBoot');

    if(!isFastBoot) {
      const placeholderUrl = get(this,'placeholderUrl');
      const imageUrl = get(this, 'imageUrl');

      if(placeholderUrl) {
        this.loadImage(placeholderUrl).then(() => {
          if ( !get(this, 'isDestroyed') && !get(this, 'isDestroying') ) {
           set(this, 'blurIsLoaded', true);
          }
        });
      }

      if(imageUrl) {
        this.loadImage(imageUrl).then(() => {
          if ( !get(this, 'isDestroyed') && !get(this, 'isDestroying') ) {
           set(this, 'imageIsLoaded', true);
          }
        });
      }
    }
  },

  loadImage(url) {
    return new Promise((resolve, reject) => {
      let image = new Image();

      image.onload = () => {
        run( () => resolve() );
      };

      image.onerror = () => {
        run( () => reject() );
      };

      image.src = url;
    });
  },

  blockStyle: computed('placeholderBlockWidth', 'placeholderBlockHeight', 'imageIsLoaded', 'blurIsLoaded', function() {
    if (get(this, 'imageIsLoaded') || get(this, 'blurIsLoaded')) {
      return Ember.String.htmlSafe("");
    }

    const placeholderBlockWidth = parseInt(get(this, 'placeholderBlockWidth'));
    const placeholderBlockHeight = parseInt(get(this, 'placeholderBlockHeight'));

    const max = get(this, 'placeholderBlockFixedSize') ? '' : 'max-';
    const aspectRatio = 100 * placeholderBlockHeight / placeholderBlockWidth;
    const padding = get(this, 'placeholderBlockFixedSize') ? '' : `padding-bottom:${aspectRatio}%`;

    return Ember.String.htmlSafe(`${max}height:${placeholderBlockHeight}px;${max}width:${placeholderBlockWidth}px;${padding}`);
  })
});
