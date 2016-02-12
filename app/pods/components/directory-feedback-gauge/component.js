import Ember from 'ember';

const {
  computed,
  get,
  set
} = Ember;

export default Ember.Component.extend({
  classNames: ['DirectoryFeedbackGauge'],
  rendered: false,

  value: null,
  size: null,

  gaugeStyleTop: null,
  gaugeStyleBottom: null,

  percent: null,

  init(params) {
    this._super();
    console.log("ingauge",get(this,'color'));
    //set initial params
    let style = new Ember.String.htmlSafe( get(this,'rect') );

    set(this,'gaugeStyleTop',  style);
    set(this,'gaugeStyleBottom', style);

  },

  boxStyle: computed('size',function(){
    let side = get(this,'size');
    return new Ember.String.htmlSafe("width:" + side + "px;height:" + side + "px;");
  }),

  scoreStyle: computed('size',function(){
    let side = get(this,'size');
    return new Ember.String.htmlSafe( "color:" + get(this,'color') + "font-size:" + side/3 +"px;");
  }),

  coverStyleAtop: computed('size',function(){
    return new  Ember.String.htmlSafe( get(this,'rect'));
  }),

  percent: computed('value',function(){
    let score = get(this,'value');
    return parseInt( score * 100 );
  }),

  rect: computed('size',function(){
    let side = get(this,'size');
    return "clip:rect(" + side/2 + "px," + side + "px," + side + "px,0px);";
  }),

  color: computed('value',function(){
    let score = get(this,'value');
    let factor = score * score * score;

    return "hsl("+Math.round(factor*120)+",100%,"+Math.round(50 - 25*factor)+"%);";
  }),

  rotation: function(score){
    let transform = "rotateZ("+Math.round(score*360)+"deg)";
    let transforms = [
      "transform:"+transform,
      "-webkit-transform:"+transform,
      "-moz-transform:"+transform,
      "-o-transform:"+transform,
      "-ms-transform:"+transform
    ];
    return transforms.join(';') + ";" ;
  },

  didRender() {
    this._super(...arguments);

    if(!get(this,'rendered')){
      let score = get(this,'value');
      let scoreTop = score > 0.5 ? 0.5 : score;

      //reset properties
      let styleTop = new Ember.String.htmlSafe( get(this,'rect') + "background-color:" + get(this,'color') + this.rotation(scoreTop) );
      let styleBottom = new Ember.String.htmlSafe( get(this,'rect') + "background-color:" + get(this,'color') + this.rotation(score) );
      //page render delay
      setTimeout( () => {
        set(this,'gaugeStyleTop', styleTop );
        if(score > 0.5){
          set(this,'gaugeStyleBottom', styleBottom );
          //bottom half delay
          setTimeout( ()=>{
            set(this,'coverStyleAtop',new Ember.String.htmlSafe('display:none;'));
          },650);
        }
        set(this,'rendered',true);
      },1000);
    }
  }
});
