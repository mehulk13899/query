import axios from "axios";
import { useEffect, useState } from "react";
import { Button, TextField, Typography, Container, Grid } from "@mui/material";
import Conversation from "./Conversation";
import { makeStyles } from "@mui/styles";
import theme from "../mui-theme";

const useStyles = makeStyles((theme) => ({
  btn: { height: "56px", marginLeft: "10px !important" },
}));

function Chat() {
  const classes = useStyles();
  const [Ticket, setTicket] = useState([]);
  const [TicketId, setTicketId] = useState("");

  function onInputChange(e) {
    setTicketId(e.target.value);
  }

  function getTicket(e) {
    e.preventDefault();
    axios
      .get(
        process.env.REACT_APP_API_URL + "/conversation/" + TicketId + "/getConversation"
      )
      .then((result) => {
        setTicket(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  let ticket;
  if (Ticket.length != 0) {
    ticket = Ticket[0];
  }

  var ticketData = (
    <>
      <Grid container spacing="2" className="details-grid">
        <Grid item xs="1" md="1.6"></Grid>
        <Grid item xs="10" md="8">
          <Typography variant="h6" className="ticket-id">
            Ticket ID: {ticket?.ticketId}
          </Typography>
          <Typography variant="h6" className="mob-no">
            Mobile No: {ticket?.mobile}
          </Typography>
        </Grid>
        <Grid item xs="1" md="1"></Grid>
      </Grid>
      {ticket?.conversation?.map((conver) => (
        <Conversation key={conver.id} data={conver} className="conversation"></Conversation>
      ))}
    </>
  );

  var noTicket = <h2>No Ticket Found</h2>;

  return (
    <div>
      <Container className="container-input">
        <TextField
          label="Ticket ID"
          variant="outlined"
          className="ticket-input"
          value={TicketId}
          onChange={onInputChange}
        />
        <Button variant="contained" className={classes.btn} onClick={getTicket}>
          Get
        </Button>
      </Container>
      {Ticket.length ? ticketData : noTicket}
    </div>
  );
}

export default Chat;
