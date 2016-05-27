import Ember from 'ember';

const {
  computed,
  inject,
  get,
  set,
  setProperties
} = Ember;

export default Ember.Component.extend({
  classNames: ['DirectoryFeedback'],
  api: inject.service('api'),
  isOpen: false,
  isAsking: true,
  feedbackLeft: false,
  questionNumber: 1,
  questions: null,

  model: null,

  init() {
    this._super();
    this.questionsMake();
  },

  questionsMake() {
    let name = get(this,'model.name');
    let questions = [];

    //defined the question set
    if( get(this,'model.has_retail_location') ){
      questions = [
          {text:`Would you recommend ${name} to a friend?`, category:'recommend'}
        ];
    }else{
      questions = [
          {text:`Would you recommend ${name} to a friend?`, category:'recommend'}
        ];
    }
    //add common attributes
    questions.forEach( function(question, index){
      Ember.setProperties(question, {
        no: 'unchecked',
        yes: 'unchecked',
        //for liquid-fire comparison
        index: index
      });

    });
    set(this,'questions', questions);
  },

  questionsLength: computed.alias('questions.length'),

  questionCurrent: computed('questionNumber', function(){
    return get(this, 'questions').objectAt( get(this, 'questionNumber') - 1) ;
  }),

  questionsCurrentIndex: computed('questionNumber', function(){
    return get(this, 'questionNumber') - 1;
  }),

  backButtonVisible: computed.gt('questionNumber', 1),

  user: computed.alias('session.currentUser'),

  isSignedIn: computed.notEmpty('user'),

  actions: {
    toggleDisplay() {
      this.toggleProperty('isOpen');
    },

    checkAnswer(bool) {
      setProperties( get(this, 'questionCurrent'), {
        no: bool ? 'notchecked' : 'checked',
        yes: bool ? 'checked' : 'notchecked'
      });

      this.send('nextQuestion');
    },

    previousQuestion() {
      this.decrementProperty('questionNumber');

      if( get(this, 'questionNumber') >= get(this, 'questionsLength')){
        set(this, 'isAsking', true);
      }
    },

    nextQuestion() {
      this.incrementProperty('questionNumber');

      if(get(this,'questionNumber') > get(this,'questionsLength')){
        set(this,'isAsking',false);
      }
    },

    updateFeedback() {
      const model = get(this, 'model');

      model.reload();

      set(this,'feedbackLeft', true);
    },

    //in development, to be determined best way to do this
    submitFeedback() {
      const api = get(this, 'api');
      const model_id = get(this, 'model.id');
      let feedbackToSend = {};

      get(this,'questions').forEach( function(question) {
        feedbackToSend[question.category] = question.yes === 'checked';
      });

      api.createFeedback(model_id, {
        feedback: feedbackToSend
      }).then( () => {
        this.send('updateFeedback', feedbackToSend);
        this.toggleProperty('isOpen');
      });
    }
  }
});
