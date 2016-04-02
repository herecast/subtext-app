
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

export default {
  deserialize: function(list) {
    let output = {};
    list.forEach((str) => {
      let [daysStr, hoursStr] = str.split("|");
      let daySplit = daysStr.split('-');
      let hours = hoursStr.split('-');

      let dayList = [];
      if (daySplit.length > 1) {
        if( daySplit.length === 2 &&
            daySplit.contains('Sa') &&
            daySplit.contains('Su')) {
          // This is a weekend schedule,
          dayList.push('Sa');
          dayList.push('Su');
        } else {
          let day1Index = dayOrder.indexOf(daySplit[0]);
          let day2Index = dayOrder.indexOf(daySplit[1]);

          for(var i = day1Index; i <= day2Index; i++) {
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

  serialize: function(data) {
    // Group days by same open & close time
    const groupedData = {};
    for(var k in data) {
      var open = data[k].open;
      var close = data[k].close;
      var dateString = `${open}-${close}`;

      groupedData[dateString] = groupedData[dateString] || [];
      groupedData[dateString].push(days[k]);
    }

    const returnData = [];

    for(k in groupedData) {
      if(groupedData.hasOwnProperty(k)) {
        var timeRange = k;
        var timeGroup = groupedData[timeRange];

        if(timeGroup.length > 1) {
          timeGroup.sort(sortByDayOrderIndex);

          if( timeGroup.length === 2 &&
              timeGroup.contains('Sa') &&
              timeGroup.contains('Su') ) {
            // This is a weekend schedule,
            // Group Sa & Su together
            returnData.push(`Sa-Su|${timeRange}`);
          } else {
            // group by proximity (next/prev day)
            var pGroups = [];
            var lastday;
            var index = 0;
            for(k in timeGroup) {
              if(timeGroup.hasOwnProperty(k)) {
                var day = timeGroup[k];
                var dayCountDifference = (dayOrder.indexOf(day) - dayOrder.indexOf(lastday));
                if(pGroups.length > 0 && dayCountDifference > 1) {
                   index++;
                }
                lastday = day;
                pGroups[index] = pGroups[index] || [];
                pGroups[index].push(day);
              }
            }

            for(k in pGroups) {
              if(pGroups.hasOwnProperty(k)) {
                var group = pGroups[k];
                if (group.length > 1) {
                  var firstDay = group[0];
                  var lastDay = group.slice(-1)[0];
                  returnData.push(`${firstDay}-${lastDay}|${timeRange}`);
                } else {
                  returnData.push(`${group[0]}|${timeRange}`);
                }
              }
            }
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
