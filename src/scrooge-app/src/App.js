import './App.css';
import * as React from "react";
import * as XLSX from 'xlsx';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import { makeStyles } from '@material-ui/core/styles';

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

  // To determine if analyze-button is disabled or not (date check)
  const readyToAnalyze = Boolean(new Date(startDate) <= new Date(endDate) && startDate !== undefined && endDate !== undefined);
  
  // Greeting and name for user
  const greeting = "Time to make a fortune";
  const name = "Scrooge";
  

  // function for updating stock data
  const updateData = async () => {
    await fetch('api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({data: data})
    })
  }

  // When page is loaded, application in initialized with empty data
  React.useEffect(() => {
    if (data === null) {
      updateData();  
    }
  })

  // Parsing stock data from csv to JSON
  const csvToJSON = dataString => {
    
    // Parsing data lines to array and parsing column headers from first row
    const lines = dataString.split(/\r\n|\n/);
    const dataHeaders = lines[0].split(", ");

    const dataArray = [];

    for (let i = 1; i < lines.length; i++) {
      const rowData = lines[i].split(", ");
      if (dataHeaders && rowData.length === dataHeaders.length) {
        const rowObj = {};
        for (let j = 0; j < dataHeaders.length; j++) {
          let dataItem = rowData[j];
          if (dataHeaders[j]) {
            rowObj[dataHeaders[j]] = dataItem;
          }
        }
        dataArray.push(rowObj);
      }
    }
    
    // Log can be erased later
    console.log(dataArray);
    setData(dataArray);
  } 


  /*
   * Event handlers
   *
   */

  // reading csv file
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        // Parsing file data
        const binaryString = evt.target.result;
        const binaryWorksheets = XLSX.read(binaryString, {type: 'binary'});

        // Getting first sheet of the document
        const worksheetName = binaryWorksheets.SheetNames[0];
        const worksheet = binaryWorksheets.Sheets[worksheetName];

        const csvData = XLSX.utils.sheet_to_csv(worksheet, {header: 1});
        csvToJSON(csvData);
      }
      reader.readAsBinaryString(file);
    }

  }

  // calling for updateData function for posting data to API
  const fetchDataImport = () => {
    updateData();
    setImported(true);
    setAnalyzedData(null);
  }

  // POST method to api for analyzing data within given dates
  const handleAnalysis = () => {
    const fetchAnalysis = async () => {
      const response = await fetch('api/data/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({start: startDate, end: endDate})
      });
      const res = await response.json();
      setAnalyzedData(res);
    };
    fetchAnalysis();
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

      {/* Date inputs are rendered if data is imported */}
      {imported ? (
        <form>
        <TextField
          className={classes.dates}
          id="start-date"
          label="Start Date"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={updateStart}
        />
        <TextField
          className={classes.dates}
          id="end-date"
          label="End Date"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={updateEnd}
        />
        {/* Analyze button activates if inputs are valid enough */}
        <Button color="inherit" onClick={handleAnalysis} disabled={!readyToAnalyze} className={classes.buttons}>Analyze</Button>
      </form>
      ) : (
        <div />
      )}

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