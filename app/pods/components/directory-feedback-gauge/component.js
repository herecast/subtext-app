import Ember from 'ember';
import InViewportMixin from '../../../mixins/in-viewport';

const {
  computed,
  get,
  set
} = Ember;

export default Ember.Component.extend(InViewportMixin, {
  classNames: ['DirectoryFeedbackGauge'],

  rendered: false,
  gaugeStyleTop: null,
  gaugeStyleBottom: null,
  coverAtopClass: null,

  value: null,
  size: null,

  init() {
    this._super();
    //initial clipped elements
    let style = new Ember.String.htmlSafe( get(this,'rect') );
    set(this, 'gaugeStyleTop',  style);
    set(this, 'gaugeStyleBottom', style);
    //initialize the viewport variable - can be done through classNameBindings
    get(this, 'enteredViewport');
  },

  boxStyle: computed('size', function(){
    let side = get(this, 'size');
    return new Ember.String.htmlSafe("width:" + side + "px;height:" + side + "px;");
  }),

  scoreStyle: computed('size', function(){
    let side = get(this, 'size');
    return new Ember.String.htmlSafe( "color:" + get(this,'color') + "font-size:" + side/3 + "px;");
  }),

  coverStyleAtop: computed('size', function(){
    return new  Ember.String.htmlSafe( get(this, 'rect') );
  }),

  percent: computed('value', function(){
    let score = get(this, 'value');
    return parseInt( score * 100 );
  }),

  rect: computed('size', function(){
    let side = get(this, 'size');
    return "clip:rect(" + side/2 + "px," + side + "px," + side + "px,0px);";
  }),

  color: computed('value', function(){
    let score = get(this, 'value');
    let factor = score * score * score;

    return "hsl(" + Math.round(factor*120) + ",100%," + Math.round(50 - 25*factor) + "%);";
  }),

  rotation: function(score){
    let transform = "rotateZ(" + Math.round(score*360) + "deg)";
    let transforms = [
      "transform:" + transform,
      "-webkit-transform:" + transform,
      "-moz-transform:" + transform,
      "-o-transform:" + transform,
      "-ms-transform:" + transform
    ];
    return transforms.join(';') + ";" ;
  },

  duration: function(score){
    let duration = score + "s";
    let durations = [
      "transition-duration:" + duration,
      "-webkit-transition-duration:" + duration,
      "-moz-transition-duration:" + duration,
      "-o-transition-duration:" + duration,
      "-ms-transition-duration:" + duration
    ];
    return durations.join(';') + ";" ;
  },

  animate: Ember.observer('enteredViewport', function(){
    //so animation only fires once
    if( get(this, 'enteredViewport') && !get(this, 'rendered') ){
      let score = get(this, 'value');
      let scoreTop = score > 0.5 ? 0.5 : score;
      //reset properties
      let styleTop = new Ember.String.htmlSafe( get(this,'rect') + "background-color:" + get(this,'color') + this.rotation(scoreTop) );
      let styleBottom = new Ember.String.htmlSafe( get(this,'rect') + "background-color:" + get(this,'color') + this.rotation(score) + this.duration(score) );
      //run animations
      set(this,'gaugeStyleTop', styleTop );
      if(score > 0.5){
        set(this, 'gaugeStyleBottom', styleBottom );
        set(this, 'coverAtopClass', 'coverGone');
      }
      set(this, 'rendered', true);
    }
    return;
  })

});
