const days = {
  Sunday: 'Su',
  Monday: 'Mo',
  Tuesday: 'Tu',
  Wednesday: 'We',
  Thursday: 'Th',
  Friday: 'Fr',
  Saturday: 'Sa'
};

const dayOrder = ['Su','Mo','Tu','We','Th','Fr','Sa'];

let daysInverted = {};

for(var key in days) {
  daysInverted[days[key]] = key;
}

function sortByDayOrderIndex(a, b) {
  return dayOrder.indexOf(a) - dayOrder.indexOf(b);
}

function groupDaysByProximity(timeGroup, timeRange, returnData) {
  let pGroups = [];
  let index = 0;
  let lastday;
  let lastDay;
  let dayCountDifference;
  let firstDay;


  timeGroup.forEach(function(day) {
    dayCountDifference = (dayOrder.indexOf(day) - dayOrder.indexOf(lastday));

    if(pGroups.length > 0 && dayCountDifference > 1) {
       index++;
    }

    lastday = day;
    pGroups[index] = pGroups[index] || [];
    pGroups[index].push(day);
  });

  pGroups.forEach(function(group) {
     if (group.length > 1) {
       firstDay = group[0];
       lastDay = group.slice(-1)[0];

       returnData.push(`${firstDay}-${lastDay}|${timeRange}`);
     } else {
       returnData.push(`${group[0]}|${timeRange}`);
     }
  });
  return returnData;
}

export default {
  deserialize(list) {
    let output = {};
    list.forEach((str) => {
      let [daysStr, hoursStr] = str.split("|");
      let daySplit = daysStr.split('-');
      let hours = hoursStr.split('-');

      let dayList = [];

      if (daySplit.length > 1) {
        if (daySplit.length === 2 &&
            daySplit.includes('Sa') &&
            daySplit.includes('Su')) {

          if (daySplit.indexOf('Sa') < daySplit.indexOf('Su')) {
            // This is a weekend schedule,
            dayList.push('Sa');
            dayList.push('Su');
          } else {
            // This is a full-week schedule,
            let day1Index = dayOrder.indexOf(daySplit[0]);
            let day2Index = dayOrder.indexOf(daySplit[1]);

            for (let i = day1Index; i <= day2Index; i++) {
              dayList.push( dayOrder[i] );
            }
          }
        } else if (daySplit.length === 2 && daySplit.includes('Mo') && daySplit.includes('Su')) {
          if (daySplit.indexOf('Mo') < daySplit.indexOf('Su')) {
            dayList = dayOrder;
          }
        } else {
          let day1Index = dayOrder.indexOf(daySplit[0]);
          let day2Index = dayOrder.indexOf(daySplit[1]);

          for(let i = day1Index; i <= day2Index; i++) {
            dayList.push( dayOrder[i] );
          }
        }
      } else {
        dayList.push(daySplit[0]);
      }

      dayList.forEach((day)=>{
        output[ daysInverted[day] ] = {
          open: hours[0],
          close: hours[1]
        };
      });
    });

    return output;
  },

  serialize(data) {
    // data example: {'Monday': {'close': '00:00', 'open': '00:00' }}
    let returnData = [];
    const groupedData = {};

    // Group days by same open & close time
    for(let k in data) {
      // k is the full day name ie., 'Tuesday'
      let open = data[k].open;
      let close = data[k].close;
      let dateString = `${open}-${close}`;

      groupedData[dateString] = groupedData[dateString] || [];

      // days are key/value pairs ('Tuesday':'Tu'),
      groupedData[dateString].push(days[k]);
    }

    for(let k in groupedData) {
      // k is a time range e.g. '00:00-00:00'
      // groupedData: { '00:00-00:00': ['Mo', 'Tu'], ... }
      if(groupedData.hasOwnProperty(k)) {
        let timeRange = k;
        let timeGroup = groupedData[timeRange];

        if(timeGroup.length > 1) {
          timeGroup.sort(sortByDayOrderIndex);

          if( timeGroup.length === 2 &&
              timeGroup.includes('Sa') &&
              timeGroup.includes('Su') ) {
            // This is a weekend schedule,
            // Group Sa & Su together
            returnData.push(`Sa-Su|${timeRange}`);
          } else {
            returnData = groupDaysByProximity(timeGroup, timeRange, returnData);
          }
        } else {
          returnData.push(`${timeGroup[0]}|${timeRange}`);
        }
      }
    }
    // Sort results by day order
    returnData.sort(function(a, b) {
      var af = a.split(/[-|]/)[0];
      var bf = b.split(/[-|]/)[0];

      return dayOrder.indexOf(af) - dayOrder.indexOf(bf);
    });

    return returnData;
  }
};
