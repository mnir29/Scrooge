import './App.css';
import * as React from "react";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import { makeStyles } from '@material-ui/core/styles';
import { parseCSV } from './parseCSV';
import { updateData, fetchAnalysis } from './apiCalls';
import DateInputs from './DateInputs';

const useStyles = makeStyles((theme) => ({

  dates: {
    padding: theme.spacing(1),
  },
  buttons: {
    padding: theme.spacing(1),
  },
  analysis: {
    padding: theme.spacing(1),
  },
  listItem: {
    display: "block",
    textAlign: "center",
  }

}));

function App() {

  // useState hooks
  const [data, setData] = React.useState(null);
  const [imported, setImported] = React.useState(false);
  const [startDate, setStartDate] = React.useState();
  const [endDate, setEndDate] = React.useState();
  const [analyzedData, setAnalyzedData] = React.useState(null);

  // Instructions for user change according to inputs and whether they are valid
  let instruction;
  if (!imported) {
    instruction = "Import stock data to analyze as CSV file";
  } else if (startDate === undefined || endDate === undefined) {
    instruction = "Pick a date range to analyze the data within"
  } else if (new Date(startDate) > new Date(endDate)) {
    instruction = "End date should be later than start date!";
  } else if (analyzedData === null) {
    instruction = "Good to go, let's analyze!";
  } else {
    instruction = "May this fine data be helpful!";
  }

  // Greeting and name for user
  const greeting = "Time to make a fortune";
  const name = "Scrooge";

  // When page is loaded, application in initialized with empty data
  React.useEffect(() => {
    if (data === null) {
      updateData(data);  
    }
  })

  /*
   * Event handlers
   *
   */

  // reading and parsing csv file
  const handleFileUpload = (event) => {
    setData(parseCSV(event));
  }

  // calling for updateData function for posting data to API
  const fetchDataImport = () => {
    updateData(data);
    setImported(true);
    setAnalyzedData(null);
  }

  // fetching analysis of data
  const handleAnalysis = () => {
    fetchAnalysis(startDate, endDate)
      .then(result => setAnalyzedData(result));
  } 

  // updating startdate
  const updateStart = (event) => {
    // parsing date string to suitable format: m/d/yy
    const dateArray = event.target.value.split("-");
    const day = parseInt(dateArray[2]);
    const month = parseInt(dateArray[1]);
    const year = dateArray[0].charAt(2) + dateArray[0].charAt(3);
    const date = `${month}/${day}/${year}`
    setStartDate(date);
  }

  // updating startdate
  const updateEnd = (event) => {   
    // parsing date string to suitable format: m/d/yy
    const dateArray = event.target.value.split("-");
    const day = parseInt(dateArray[2]);
    const month = parseInt(dateArray[1]);
    const year = dateArray[0].charAt(2) + dateArray[0].charAt(3);
    const date = `${month}/${day}/${year}`
    setEndDate(date);
  }

  const classes = useStyles();

  return (
    <div className="App">
      
      {/* Greetings, instructions and file input */}
      <Typography variant="h6">{greeting}, {name}!</Typography>
      <Typography variant="subtitle1">{instruction}</Typography>
      <input
        accept=".csv"
        id="button-file-upload"
        multiple
        type="file"
        onChange={handleFileUpload}
      />

      {/* Import button activates, when file consisting data is added */}
      <label htmlFor="button-file-upload">
        <Button color="inherit" onClick={fetchDataImport} disabled={data === null} className={classes.buttons}>
          Import
        </Button>
      </label>

      <DateInputs
        imported={imported}
        startDate={startDate}
        endDate={endDate}
        updateStart={updateStart}
        updateEnd={updateEnd}
        handleAnalysis={handleAnalysis}
      />

      {/* Data analysis is shown, when back end returns something */}
      {analyzedData !== null ? (
        <div className={classes.analysis}>

            <Typography>
              In imported stock's historical data the Close/Last price increased {analyzedData.maxBullish} days in a row
              between {analyzedData.start} and {analyzedData.end}.
            </Typography>
            <List
              subheader={
                <ListSubheader id="volumes-and-changes-list-subheader">
                  Date(s) with highest trading volume(s) and  price change(s) within a day
                </ListSubheader>
              }
            >
              {
                analyzedData.maxVolsAndChanges.map((item, index) => {
                  return (
                    <ListItem key={index} className={classes.listItem}>
                      Date: {item.date} Volume: {item.volume} Change: {item.change}
                    </ListItem>
                  )
                })
              }
            </List>
            <List
              subheader={
                <ListSubheader id="openings-list-subheader">
                  Date(s) with best opening(s)
                </ListSubheader>
              }
            >
              {
                analyzedData.bestOpenings.map((item, index) => {
                  return (
                    <ListItem key={index} className={classes.listItem}>
                      Date: {item.date} Price change-%: {item.percentage}%
                    </ListItem>
                  )
                })
              }
            </List>
   
        </div>
      ) : (
        <div />
      )}

    </div>
  );
}

export default App;