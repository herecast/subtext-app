import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../../../config/environment';

const {
  computed,
  get,
  set
} = Ember;

export default Ember.Component.extend({
  classNames: ['DirectoryFeedback'],
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
          {text:`Were you satisfied with the services performed or offered by ${name}?`, category:'satisfaction'},
          {text:`Were their facilities clean and attractive?`, category:'cleanliness'},
          {text:`Do you feel that what you paid for the services or products was reasonable?`, category:'price'},
          {text:`Would you recommend ${name} to a friend?`, category:'recommend'}
        ];
    }else{
      questions = [
          {text:`Did the service representative from ${name} arrive on time?`, category:'satisfaction'},
          {text:`Were you satisfied with the work performed?`, category:'cleanliness'},
          {text:`Do you feel that what you paid for the services provided was reasonable?`, category:'price'},
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

    checkAnswer: function(bool){
      Ember.setProperties( get(this, 'questionCurrent'), {
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

    updateFeedback(feedbackToSend) {
      let feedback_num = get(this, 'model.feedback_num');
      let feedbackFromModel = get(this, 'model.feedback');
      let categories = Object.keys(feedbackFromModel);
      //go through and recalculate each one.
      categories.forEach( (category) => {
        let total = feedbackFromModel[category] * feedback_num;
        let newRating = (total + feedbackToSend[category] ) / (feedback_num + 1);

        set(this, 'model.feedback.' + category, newRating);

      });
      //uptick
      this.incrementProperty('model.feedback_num');
      set(this,'feedbackLeft', true);
    },
    //in development, to be determined best way to do this
    submitFeedback() {
      let feedbackToSend = {};
      get(this,'questions').forEach( function(question) {
        feedbackToSend[question.category] = question.yes === 'checked';
      });
      //send to the api
      const url = `${config.API_NAMESPACE}/businesses/${get(this, 'model.id')}/feedback`;

      ajax(url, {
        type: 'POST',
        data: feedbackToSend
      }).then( () => { 
        this.send('updateFeedback', feedbackToSend);
        this.toggleProperty('isOpen');
      });
    }
}
});
