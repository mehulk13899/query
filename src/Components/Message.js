import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  Divider,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import theme from "../mui-theme";

const useStyles = makeStyles((theme) => {});

function Message({ data }) {
  const classes = useStyles();
  return (
    <>
      <Grid container spacing="2" className="conversation-grid">
        <Grid item md="0.7"></Grid>

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
            <Typography variant="p" className="person user">
              User
            </Typography>
          ) : (
            <Typography variant="p" className="person system">
              System
            </Typography>
          )}
        </Box>
        <Paper
          elevation={1}
          className={
            "paper " + (data.userReply ? "user-message" : "system-message")
          }
        >
          <Box
            className="message-date"
            sx={{
              float: "right",
              marginLeft: "8px",
              marginRight: "12px",
            }}
          >
            <Typography variant="p" className="message">
              <pre>{data.sms}</pre>
            </Typography>
            <Typography variant="p" className="date">
              {new Date(data.dateInString).toLocaleString()}
            </Typography>
          </Box>
        </Paper>

        <Grid item md={1}></Grid>
      </Grid>
      <Divider variant="middle" />
    </>
  );
}
export default Message;
