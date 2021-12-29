import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import theme from "../mui-theme";

const useStyles = makeStyles((theme) => {});

function Conversation({ data }) {
  const classes = useStyles();
  return (
    <Grid container spacing="2" className="conversation-grid">
      <Grid item md="1"></Grid>
      <Box
        sx={{
          width: 50,
          height: "auto",
          float: "left",
          margin: "8px",
          display: "flex",
          flexDirection: "column",
          paddingTop: "18px",
        }}
      >
        {data.userReply ? (
          <Typography variant="p" className="person">
            User
          </Typography>
        ) : (
          <Typography variant="p" className="person">
            System
          </Typography>
        )}
      </Box>
      <Paper elevation={1} className="paper">
        <Box
          className="message-date"
          sx={{
            width: 1000,
            float: "right",
            marginLeft: "8px",
          }}
        >
          <Typography variant="p" className="message">
            <pre>{data.sms}</pre>
          </Typography>
          <Typography variant="p" className="date">
            {data.dateInString}
          </Typography>
        </Box>
      </Paper>
      <Grid item md="1"></Grid>
    </Grid>
  );
}
export default Conversation;
