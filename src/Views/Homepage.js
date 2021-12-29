import { useEffect, useState } from "react";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import theme from "../mui-theme";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../Components/Header";

const useStyles = makeStyles((theme) => ({
  btn: { height: "56px", marginLeft: "10px !important" },
  ticketsPaper: {
    margin: "10px",
    marginLeft: "0px",
    padding: "6px",
    boxShadow: "none !important",
  },
}));

function Homepage() {
  const classes = useStyles();
  const { promiseInProgress } = usePromiseTracker();
  const [UserId, setUserId] = useState("");
  const [isUserFound, setIsUserFound] = useState(false);
  const [Tickets, setTickets] = useState([]);

  function onInputChange(e) {
    setUserId(e.target.value);
  }

  function getTickets(e) {
    e.preventDefault();
    trackPromise(
      axios
        .get(
          process.env.REACT_APP_API_URL +
            "/conversation/" +
            UserId +
            "/getAllTicket"
        )
        .then((result) => {
          if (result.data?.length != 0) {
            console.log("note");
            setTickets(result.data);
            setIsUserFound(true);
          } else {
            setIsUserFound(false);
          }
        })
        .catch((error) => {
          console.log(error);
        })
    );
  }

  let ticketsData = Tickets?.map((ticket) => (
    <Grid key={ticket.ticketId} container spacing="2">
      <Grid item xs="1" md="2"></Grid>
      <Grid item xs="10" md="8">
        <Link
          to={"/ticket/" + ticket.ticketId + "?userId=" + ticket.name}
          className="link"
        >
          <Paper className={classes.ticketsPaper}>
            <Grid container spacing={2}>
              <Grid item md={10}>
                <Typography variant="h6" className={classes.ticketId}>
                  Ticket ID: {ticket.ticketId}
                </Typography>

                <Typography variant="h6" className={classes.date}>
                  {new Date(ticket.date).toLocaleString()}
                </Typography>
              </Grid>
              <Grid
                item
                md={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" sx={{ float: "right" }}>
                  {ticket.ticketCurrentStatus}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Link>
      </Grid>
      <Grid item xs="1" md="2"></Grid>
    </Grid>
  ));

  let noUser = promiseInProgress ? null : UserId ? (
    <h2 className="no-user">User not found</h2>
  ) : null;
  return (
    <div className="homepage">
      <Header />
      <div className="App">
        <h1>Defined Research Chat</h1>
      </div>
      <Grid container spacing="2">
        <Grid item xs="1" md="4.6"></Grid>
        <Grid item xs="10" md="6">
          <TextField
            label="User ID"
            variant="outlined"
            className="ticket-input"
            value={UserId}
            onChange={onInputChange}
          />
          <Button
            variant="contained"
            className={classes.btn}
            onClick={getTickets}
          >
            Get
          </Button>
        </Grid>
        <Grid item xs="1" md="1"></Grid>
      </Grid>

      {isUserFound ? (
        <>
          <Grid container spacing="2">
            <Grid item xs="1" md="2"></Grid>
            <Grid item xs="10" md="6">
              <Typography variant="h6" className="user-id">
                User ID: {Tickets[0].name}
              </Typography>
              <Typography variant="h6" className="mob">
                Mobile No: {Tickets[0].mobile}
              </Typography>
            </Grid>
            <Grid item xs="1" md="1"></Grid>
          </Grid>
          <Grid container spacing="2">
            <Grid item xs="1" md="2"></Grid>
            <Grid item xs="10" md="6">
              <Typography variant="h6" className="user-id">
                Tickets:
              </Typography>
            </Grid>
            <Grid item xs="1" md="1"></Grid>
          </Grid>
          {ticketsData}
        </>
      ) : (
        noUser
      )}
    </div>
  );
}
export default Homepage;
