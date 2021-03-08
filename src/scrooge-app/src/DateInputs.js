import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  dates: {
    padding: theme.spacing(1),
  },
}));

function DateInputs (props) {

  // To check if date inputs are valid
  const readyToAnalyze = Boolean(new Date(props.startDate) <= new Date(props.endDate) && props.startDate !== undefined && props.endDate !== undefined);

  const classes = useStyles();

  return (
    <div>
    {/* Date inputs are rendered if data is imported */}
      {props.imported ? (
        <form>
        <TextField
          className={classes.dates}
          id="start-date"
          label="Start Date"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={props.updateStart}
        />
        <TextField
          className={classes.dates}
          id="end-date"
          label="End Date"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={props.updateEnd}
        />
        {/* Analyze button activates if inputs are valid enough */}
        <Button color="inherit" onClick={props.handleAnalysis} disabled={!readyToAnalyze} className={classes.buttons}>Analyze</Button>
      </form>
      ) : (
        <div />
      )}
    </div>
  );
}

export default DateInputs;