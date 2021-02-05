/*
 * Module for saving and analyzing imported stock data
 *
 * Created by: Markku Nirkkonen
 */

// Variable for saving imported data
let savedData;

/*
 * Function for saving imported data to variable
 * Returns also message and status for further help in e.g. UI
 */ 
const saveData = (data) => {
  if (data === null) {
    savedData = data;
    return {
      status: null,
      message: "No Data",
      data: savedData
    }
  }
  else {
    savedData = data;
    return {
      status: "OK",
      message: "Data saved",
      data: savedData
    }
  }
}

// Function checks start date: if start date is out of data's range, oldest date of data will be used
const checkStartDate = (start) => {
  let startDate = new Date(start);
  let oldestDataDate = new Date(savedData[savedData.length - 1].Date);

  if (startDate <= oldestDataDate) {
    startDate = oldestDataDate;
  }
  return startDate;
}

// Function checks start date: if end date is out of data's range, latest date of data will be used
const checkEndDate = (end) => {
  let endDate = new Date(end);
  let latestDataDate = new Date(savedData[0].Date);
  
  if (endDate > latestDataDate) {
    endDate = latestDataDate;
  }
  return endDate;
}

/*
 * Function finds Best openings by comparing stock opening price to 5 day moving average of closing prices
 *
 * Parameters: start date, end date as strings
 * Returns: Array of dates and best opening percentages (multiple items in array, if equal opening percentages occur)
 */
const findBestOpenings = (start, end) => {
  
  // Date checks
  let startDate = checkStartDate(start);
  let endDate = checkEndDate(end);

  let bestDifference;
  let bestOpenings = [];

  // Loop stops 5 indexes before data sets end so that 5 day SMA can be calculated
  for (let i = 0; i < savedData.length - 5; i++) {
    let date = new Date(savedData[i].Date);

    if (date <= endDate && date >= startDate) {
      
      // $ symbols removed and opening price is parsed to float.
      let opening = parseFloat(savedData[i].Open.substring(1));
      let closingPrices = 0;

      // closing prices from 5 subsequent previous days
      for (let j = 1; j <= 5; j++) {
        closingPrices += parseFloat(savedData[i+j]["Close/Last"].substring(1));
      }
      
      // 5 Day SMA for closing prices and comparison to opening price to get the change
      let closingSMA5 = closingPrices/5;
      let difference = (opening-closingSMA5)/opening;
      
      // first difference is saved for further comparison
      if (!bestDifference) {
        bestOpenings = [{date: date.toISOString().split("T")[0], percentage: (difference*100).toFixed(4)}];
        bestDifference = difference;
      } else if (difference >= bestDifference) {
        // if exactly same sizes of difference occur, all will be included
        if (difference === bestDifference) {
          bestOpenings.push({date: date.toISOString().split("T")[0], percentage: (difference*100).toFixed(4)});
        // if better difference is found, it will replace previous
        } else {
          bestOpenings = [{date: date.toISOString().split("T")[0], percentage: (difference*100).toFixed(4)}];
          bestDifference = difference;
        }
      } 
    }
  }
  return bestOpenings;
}


/*
 * function for finding longest bullish (upward) trend in stock data
 * Definition of an upward trend shall be: “Closing price of day N is higher than closing
 * price of day N-1”
 * 
 * Parameters: start date and end date as strings
 * Returns: longest upward trend as integer
 */
const findMaxBullish = (start, end) => {

  let startDate = checkStartDate(start);

  let endDate = checkEndDate(end);

  // Variables for counting longest upward trend
  let bullishCount = 0;
  let maxBullishCount = 0;

  for(let i = 0; i < savedData.length; i++) {
    
    let date = new Date(savedData[i].Date);
    
    // Every date in the data will be compared to start and end dates
    if (date <= endDate && date >= startDate && i < savedData.length - 1) {
      
      // $ symbols removed and closing price strings parsed to Floats
      let close = parseFloat(savedData[i]["Close/Last"].substring(1));
      let previousDayClose = parseFloat(savedData[i+1]["Close/Last"].substring(1));
      
      // If closing price has increased
      if (close > previousDayClose) {
        bullishCount++;
        
        // If new longest upward trend occurs
        if (bullishCount > maxBullishCount) {
          maxBullishCount = bullishCount;
        }
      }
      else {
        bullishCount = 0;
      }
    }
  }
  return maxBullishCount;
}

/*
 * Which dates within a given date range had a) the highest trading volume and b) the most
 * significant stock price change within a day (= high-low absolute change)?
 *
 */
const findMaxVolsAndChanges = (start, end) => {
  
  // Date checks
  let startDate = checkStartDate(start);
  let endDate = checkEndDate(end);

  // variables and array for max volumes and changes
  let maxVolume = 0;
  let maxChangeAbs = 0;
  let maxVolumes = [];
  let maxChanges = [];

  for(let i = 0; i < savedData.length; i++) {
    
    let date = new Date(savedData[i].Date);
    
    // Every date in the data will be compared to start and end dates
    if (date <= endDate && date >= startDate) {
      
      // volume, change range within a day and absolute change value are needed for analysis
      let volume = parseInt(savedData[i].Volume);
      let change = parseFloat(savedData[i].High.substring(1)) - parseFloat(savedData[i].Low.substring(1));
      let changeAbs = Math.abs(change);

      // if volume is greater than or equal to previous maximum volume 
      if (volume >= maxVolume) {
        
        // if maximum volume occurs multiple times, all occurrances will be saved
        if (volume == maxVolume) {
          maxVolumes.push({date: date.toISOString().split("T")[0], volume: volume, change: change.toFixed(4)});
        }
        else {
          maxVolumes = [{date: date.toISOString().split("T")[0], volume: volume, change: change.toFixed(4)}];
          maxVolume = volume;
        }
      }

      // if absolute change is greater than or equal to previous maximum absolute change
      if (changeAbs >= maxChangeAbs) {
        
        // if maximum absolute change occurs multiple times, all occurrances will be saved
        if (changeAbs == maxChangeAbs) {
          maxChanges.push({date: date.toISOString().split("T")[0], volume: volume, change: change.toFixed(4)});
        }
        else {
          maxChanges = [{date: date.toISOString().split("T")[0], volume: volume, change: change.toFixed(4)}];
          maxChangeAbs = changeAbs;
        }
      }
    }
  }

  // Concatenating changes and volumes and sorting by volume and change
  let maxVolsAndChanges = maxChanges.concat(maxVolumes);
  maxVolsAndChanges.sort((a,b) => b.change - a.change);
  maxVolsAndChanges.sort((a,b) => b.volume - a.volume);

  return maxVolsAndChanges;
}

/*
 * Function for analyzing stock data within given dates
 *
 * Returns analyze results as object
 *
 */
const analyzeData = (start, end) => {
  
  // Analyzes are made in separate functions
  let maxBullish = findMaxBullish(start, end);
  let maxVolsAndChanges = findMaxVolsAndChanges(start, end);
  let bestOpenings = findBestOpenings(start, end);
  
  return {
    start: start,
    end: end,
    maxBullish: maxBullish,
    maxVolsAndChanges: maxVolsAndChanges,
    bestOpenings: bestOpenings
  }
}

module.exports = {saveData, analyzeData};