import Ember from 'ember';

const {
  computed,
  get
} = Ember;

export default Ember.Component.extend({
  classNames: ['DirectoryBusinessFeedback'],
  model: null,

  answers: computed('model.{name,has_retail_location}', 'model.feedback', function() {
    let name = get(this, 'model.name');
    let feedback = get(this, 'model.feedback');
    //{satisfaction: "0.834", cleanliness: "0.675", price: "0.287", recommend: "0.687"}
    let answers = [];
    //defined the question set
    if( get(this, 'model.has_retail_location') ){
      answers = [
          {title: "Satisfaction", text: `said they were satisfied with the services ${name} performed or offered`, value: feedback.satisfaction},
          {title: "Cleanliness", text: `said their facilities were clean and attractive?`, value: feedback.cleanliness},
          {title: "Price", text: `said the costs or prices were what they expected`, value: feedback.price},
          {title: "Recommended", text: `said they would recommend ${name}`, value:feedback.recommend}
        ];
    }else{
      answers = [
          {title: "Satisfaction", text: `said ${name} arrived on time`, value: feedback.satisfaction},
          {title: "Cleanliness", text: `said they were satisfied with the work performed`, value: feedback.cleanliness},
          {title: "Price", text: `said the cost of work was what they expected`, value: feedback.price},
          {title: "Recommended", text: `said they would recommend ${name}`, value: feedback.recommend}
        ];
    }
    return answers;
  }),

  score: computed('model.feedback.recommend', function(){
    return parseInt( get(this,'model.feedback.recommend') * 100 ) + '%';
  }),

  actions: {
    claim() {
      this.attrs.claimBusiness();
    }
  }
});
