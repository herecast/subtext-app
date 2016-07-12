import Ember from 'ember';
import businessHoursFormat from 'subtext-ui/utils/business-hours-format';

const {
  computed,
  get
} = Ember;

export default Ember.Component.extend({
  classNames: ['DirectoryBusinessFeedback'],
  model: null,

  humanBusinessHours: computed('model.hours', function() {

    let hours = businessHoursFormat(get(this, 'model.hours'));

    return hours.map(hour => {
      return `${hour.days}: ${hour.open} - ${hour.close}`;
    });
  }),

  answers: computed('model.{name,has_retail_location}', 'model.feedback', function() {
    let name = get(this, 'model.name');
    let feedback = get(this, 'model.feedback');
    //{satisfaction: "0.834", cleanliness: "0.675", price: "0.287", recommend: "0.687"}
    let answers = [];
    //defined the question set
    if( get(this, 'model.has_retail_location') ){
      answers = [
          {title: "Satisfaction", text: `said they were satisfied with the services performed or goods offered by ${name}`, value: feedback.satisfaction},
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

  reportIncorrectInfoEmail: computed(function() {
    const mailTo = `mailto:dailyuv@subtext.org`;
    const firstLine = 'Thank you for alerting us about problems with the directory information for this business.';
    let tmp = document.createElement("DIV");
    tmp.innerHTML = `
Business name: ${get(this, 'model.name')}
Business address: ${get(this, 'model.fullAddress')}
Business telephone number:  ${get(this, 'model.phone')}
Business URL: ${get(this, 'model.websiteLink')}
Business hours: ${get(this, 'humanBusinessHours')}
Does this business still exist? (Y/N)

Please tell us just below this what you think is wrong. Thanks again for helping us build the Upper Valley’s best business directory!

Problems with the info above:
`;

    const sanitizedContent = tmp.textContent || tmp.innerText;

    const body = `${encodeURIComponent(firstLine)}%0D%0A%0D%0A${encodeURIComponent(sanitizedContent)}`;

    return `${mailTo}?subject=Please Change Info on ${encodeURIComponent(get(this, 'model.name'))}%20${get(this, 'model.id')}&body=${body}`;
  }),

  claimEmail: computed(function() {
    const mailTo = `mailto:dailyuv@subtext.org`;
    const firstLine = 'Thank you for claiming this business. Please provide the following information:';
    let tmp = document.createElement("DIV");
    tmp.innerHTML = `
Your name:
Your affiliation with this business:
Your business’s name if different from what you see in the subject line above:

We’ll need to speak with you by telephone to verify your affiliation with this business and check the information in the listing.
If the directory already contains a phone number for this business, that is where we’ll call you.
If there’s no phone number listed, or if the one listed is wrong, please add it here:

Thanks again for helping us build the Upper Valley’s best business directory!`;

    const sanitizedContent = tmp.textContent || tmp.innerText;

    const body = `${encodeURIComponent(firstLine)}%0D%0A%0D%0A${encodeURIComponent(sanitizedContent)}`;

    return `${mailTo}?subject=Claiming ${encodeURIComponent(get(this, 'model.name'))}%20${get(this, 'model.id')}&body=${body}`;
  }),
});
