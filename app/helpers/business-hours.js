import Ember from 'ember';

export function businessHours(params) {

  let days_arr = {
  Mo:"Monday",
  Tu:"Tuesday",
  We:"Wednesday",
  Th:"Thursday",
  Fr:"Friday",
  Sa:"Saturday",
  Su:"Sunday"
  };

  let hours_array = [];

  params[0].forEach(function(hours, index_params){
    hours_array[index_params] = {
      days:'',
      hours:''
    };
    //examples Mo-Fr|08:00-18:00 .... Mo,Th|09:30-17:00 (schema.org standards)
    //algorithm splits by | first. Days on left & hours on right
    //then checks days and splits. if - then through, if ',' then 'and'
    let temp_arr = hours.split("|");
    let separator,separator_text;

    if (temp_arr[0].indexOf("-") >= 0){
      separator = "-";
      separator_text = " through ";
    } else if (temp_arr[0].indexOf(",") >= 0){
      separator = ",";
      separator_text = ", ";
    }
    //set the days portion for return
    let days = temp_arr[0].split(separator);

    days.forEach(function(day,index){
      hours_array[index_params].days += days_arr[day];
      if(index < days.length-1) {
        hours_array[index_params].days += separator_text;
      }
    });

    //set the hours portion for return
    if(temp_arr[1] !== undefined){
      let hours = temp_arr[1].split('-');
      let start_time = hours[0].split(':');
      let end_time = hours[1].split(':');

      let start_hour_raw = parseInt(start_time[0]);
      let start_hour = start_hour_raw > 12 ? parseInt(start_time[0])-12 : parseInt(start_time[0]);
      let start_ampm = start_hour_raw >12 ? "pm" : "am";
      let start_min = start_time[1];

      let end_hour_raw = parseInt(end_time[0]);
      let end_hour = end_hour_raw > 12 ? parseInt(end_time[0])-12 : parseInt(end_time[0]);
      let end_ampm = end_hour_raw >12 ? "pm" : "am";
      let end_min = end_time[1];

      //add to array
      hours_array[index_params].open = start_hour + ":" + start_min+start_ampm;
      hours_array[index_params].close = end_hour + ":" + end_min+end_ampm;
    }

  });

  return hours_array;

}

export default Ember.Helper.helper(businessHours);
