import { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  TextareaAutosize,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  btn: { margin: "10px !important" },
  notetextarea: { width: "300px", display: "block" },
  savebtn: { marginLeft: "0px !important" },
}));

function Notes(props) {
  const classes = useStyles();
  const [Note, setNote] = useState("");

  function onTextChange(e) {
    setNote(e.target.value);
  }

  return (
    <div>
      <Typography variant="h6" className={classes.note}>
        Note:
      </Typography>
      <TextareaAutosize
        minRows={3}
        placeholder="type your note here"
        defaultValue=""
        value={Note}
        onChange={onTextChange}
        className={classes.notetextarea}
      />
      <Button
        variant="outlined"
        className={classes.btn + " " + classes.savebtn}
      >
        Save
      </Button>
    </div>
  );
}

export default Notes;
