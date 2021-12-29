import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Select,
  MenuItem,
  Fab,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import Message from "../Components/Message";
import { makeStyles } from "@mui/styles";
import theme from "../mui-theme";
import { useParams, useSearchParams } from "react-router-dom";
import Notes from "../Components/Notes";
import Comments from "../Components/Comments";
import Header from "../Components/Header";

const useStyles = makeStyles((theme) => ({
  noTicket: { textAlign: "center" },
  btn: { margin: "10px !important" },
  userId: {},
  mobileNo: {},
  ticketId: { float: "left" },
  date: { float: "right" },
}));

function Ticket(props) {
  const classes = useStyles();
  const [Ticket, setTicket] = useState();
  const [TicketFound, setTicketFound] = useState(true);
  const [TicketStatus, setTicketStatus] = useState();
  const [ResErrorMessage, setResErrorMessage] = useState("Some error occured");
  const [AssignAdminResErrorMessage, setAssignAdminResErrorMessage] =
    useState();
  const [Admins, setAdmins] = useState([]);
  const [SelectedAdmin, setSelectedAdmin] = useState("");

  let { ticketId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  let userId = searchParams.get("userId");

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "/conversation/userId/" +
          userId +
          "/userTicket/" +
          ticketId +
          "/getTicket"
      )
      .then((result) => {
        if (result.data) {
          setTicket(result.data);
          setTicketFound(true);
        } else {
          setTicketFound(false);
        }
      })
      .catch((error) => {
        if (error.response) {
          setResErrorMessage(error.response.data.message);
        }
        console.log("Error: ", error.message);

        setTicketFound(false);
      });
  }, [ticketId, userId]);

  useEffect(() => {
    if (
      Ticket?.ticketCurrentStatus === "New" ||
      Ticket?.ticketCurrentStatus === "Resolved"
    ) {
      axios
        .get(process.env.REACT_APP_API_URL + "/conversationAdmin/admins")
        .then((result) => {
          if (result.data) {
            setAdmins(result.data);
            console.log(result.data);
          }
        })
        .catch((error) => {
          console.log("Error: ", error.message);
        });
    }
  }, [Ticket?.ticketCurrentStatus]);

  const assignAdminToTicket = (adminId) => {
    let reqData = { adminId: adminId };
    axios
      .post(
        process.env.REACT_APP_API_URL +
          "/conversation/userId/" +
          userId +
          "/userTicket/" +
          ticketId +
          "/ticketAssign",
        reqData
      )
      .then((result) => {
        if (result.data) {
          setTicket(result.data);
          setTicketFound(true);
        } else {
          setTicketFound(false);
        }
      })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data.message);
        }
        console.log("Error: ", error.message);
      });
  };

  const changeTicketStatus = (status) => {
    let reqData = { ticketState: status };
    axios
      .post(
        process.env.REACT_APP_API_URL +
          "/conversation/userId/" +
          userId +
          "/userTicket/" +
          ticketId +
          "/changeTicketState",
        reqData
      )
      .then((result) => {
        if (result.data) {
          setTicket(result.data);
          setTicketFound(true);
        } else {
          setTicketFound(false);
        }
      })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data.message);
        }
        console.log("Error: ", error.message);
      });
  };

  const handleChange = (event) => {
    setSelectedAdmin(event.target.value);
  };

  const statusData =
    Ticket?.ticketCurrentStatus === "New" ||
    Ticket?.ticketCurrentStatus === "Resolved" ? (
      <>
        <Typography variant="h6" className={classes.admintext}>
          Assign Admin:
        </Typography>
        <Select
          id="admins"
          value={SelectedAdmin}
          label="Admin"
          onChange={handleChange}
          sx={{ width: "200px", color: "black" }}
        >
          {Admins?.map((admin) => (
            <MenuItem key={admin.id} value={admin.id}>
              {admin.name}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="outlined"
          onClick={() => {
            assignAdminToTicket(SelectedAdmin);
          }}
          className={classes.btn}
        >
          Assign
        </Button>
      </>
    ) : Ticket?.ticketCurrentStatus === "Assigned" ||
      Ticket?.ticketCurrentStatus === "Investigating" ? (
      <>
        <Typography variant="h6" className={classes.assignedTo}>
          Assigned To: {Ticket?.ticketAssigned?.name}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => {
            changeTicketStatus(
              Ticket?.ticketCurrentStatus === "Assigned"
                ? "Investigating"
                : "Resolved"
            );
          }}
          className={classes.btn}
        >
          {Ticket?.ticketCurrentStatus === "Assigned"
            ? `Investigate`
            : `Resolve`}
        </Button>
      </>
    ) : null;

  // if (Ticket?.ticketCurrentStatus == "New") {
  // } else if (Ticket?.ticketCurrentStatus == "Assigned") {
  //   statusData = (
  //     <Button variant="outlined" className={classes.btn}>
  //       Investigate
  //     </Button>
  //   );
  // } else if (Ticket?.ticketCurrentStatus == "Investigating") {
  //   statusData = (
  //     <Button variant="outlined" className={classes.btn}>
  //       Resolve
  //     </Button>
  //   );
  // }
  var ticketData = (
    <>
      <Grid container spacing="2" className="details-grid">
        <Grid item xs="1" md="1.7"></Grid>
        <Grid item xs="10" md="9">
          <Typography variant="h6" className={classes.ticketId}>
            Ticket ID: {Ticket?.ticketId}
          </Typography>
          <Typography variant="h6" className={classes.date + " ticket-date"}>
            Date Created: {new Date(Ticket?.date).toLocaleString()}
          </Typography>
        </Grid>
        <Grid item xs="1" md="1"></Grid>
      </Grid>
      <Grid container spacing="2" className="details-grid">
        <Grid item xs="1" md="1.7"></Grid>
        <Grid item xs="10" md="9">
          <Typography variant="h6" className={classes.userId}>
            User ID: {Ticket?.name}
          </Typography>
          <Typography variant="h6" className={classes.mobileNo}>
            Mobile No: {Ticket?.mobile}
          </Typography>
        </Grid>
        <Grid item xs="1" md="1"></Grid>
      </Grid>
      <Grid container spacing="2" className="details-grid">
        <Grid item xs="1" md="1.7"></Grid>
        <Grid item xs="10" md="9">
          <Typography variant="h6" className={classes.status}>
            Status: {Ticket?.ticketCurrentStatus}
          </Typography>
          {/* if(Ticket?.ticketCurrentStatus=="Informational" || Ticket?.ticketCurrentStatus=="Informational Resolved"){} */}

          {statusData}
        </Grid>
        <Grid item xs="1" md="1"></Grid>
      </Grid>
      <Grid container spacing="2" className="details-grid">
        <Grid item xs="1" md="1"></Grid>
        <Grid item md="8">
          {Ticket?.conversation?.map((conver) => (
            <Message
              key={conver.id}
              data={conver}
              className="conversation"
            ></Message>
          ))}
        </Grid>
        <Grid item xs="10" md="3">
          <Comments userId={Ticket?.name} ticketId={Ticket?.ticketId} />
        </Grid>
        <Grid item xs="1" md="1"></Grid>
      </Grid>
    </>
  );

  return (
    <div>
      <Header />
      {Ticket ? (
        ticketData
      ) : TicketFound ? null : (
        <h2 className={classes.noTicket}>{ResErrorMessage}</h2>
      )}
    </div>
  );
}

export default Ticket;
