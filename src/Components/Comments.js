import { useEffect, useRef, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  TextareaAutosize,
  Fab,
  IconButton,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CommentIcon from "@mui/icons-material/Comment";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  btn: { margin: "4px !important" },
  commenttextarea: { resize: "none", width: "71%", float: "left" },
  addbtn: {
    marginLeft: "4px !important",
    float: "right",
    padding: "3px 9px !important",
  },

  commentsPaper: {
    margin: "10px",
    marginLeft: "0px",
    padding: "6px",
    boxShadow: "none !important",
    maxWidth: "250px",
    minWidth: "250px",
  },

  deleteIcon: {
    margin: "5px",
  },
}));

const AlwaysScrollToBottom = () => {
  const elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};

function Comments({ userId, ticketId }) {
  const classes = useStyles();
  const [Comment, setComment] = useState("");
  const [Comments, setComments] = useState([]);
  const [ResErrorMessage, setResErrorMessage] = useState("Some error occured");
  const [IsCommentBoxOpen, setIsCommentBoxOpen] = useState(false);

  function onTextChange(e) {
    setComment(e.target.value);
  }

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "/conversation/userId/" +
          userId +
          "/userTicket/" +
          ticketId +
          "/comment"
      )
      .then((result) => {
        if (result.data.length !== 0) {
          setComments(result.data);
        }
      })
      .catch((error) => {
        if (error.response) {
          setResErrorMessage(error.response.data.message);
        }
        console.log("Error: ", error.message);
      });
  }, [ticketId]);

  const addComment = (comment) => {
    let reqData = { comment: comment };
    axios
      .post(
        process.env.REACT_APP_API_URL +
          "/conversation/userId/" +
          userId +
          "/userTicket/" +
          ticketId +
          "/comment",
        reqData
      )
      .then((result) => {
        if (result.data.length != 0) {
          setComments(result.data);
        }
        setComment("");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const deleteComment = (commentId) => {
    let reqData = { commentId: commentId };
    axios
      .post(
        process.env.REACT_APP_API_URL +
          "/conversation/userId/" +
          userId +
          "/userTicket/" +
          ticketId +
          "/deleteComment",
        reqData
      )
      .then((result) => {
        if (result.data.length != 0) {
          setComments(result.data);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  let reversedComments = Comments?.slice().reverse();
  let isCommentsPresent = false;

  let commentTiles = Comments?.map((comment) => {
    if (comment.isDeleted === false) {
      isCommentsPresent = true;
    }
    return !comment.isDeleted ? (
      <Paper key={comment.id} className={classes.commentsPaper}>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={10} md={10.5} className={classes.commentDiv}>
            <Typography variant="p" className="comment-text">
              {/* <pre className={classes.pre}>{comment.comment}</pre> */}
              {comment.comment.split("\n").map((comment) => (
                <>
                  {comment}
                  <br />
                </>
              ))}
            </Typography>
            <Typography variant="p" className="comment-date">
              {new Date(comment.date).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item md={1.5}>
            <DeleteOutlineIcon
              onClick={() => deleteComment(comment.id)}
              className={classes.deleteIcon + " comment-del-icon"}
            />
          </Grid>
        </Grid>
      </Paper>
    ) : null;
  });

  return (
    <>
      <div className="comments-container">
        {IsCommentBoxOpen ? (
          <Box sx={{ minWidth: "280px" }}>
            <Grid container>
              <Grid
                item
                md={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6">Comments</Typography>
              </Grid>
            </Grid>
            <div className="comment-box">
              {isCommentsPresent ? (
                commentTiles
              ) : (
                <Typography variant="h7">No comments</Typography>
              )}
              <AlwaysScrollToBottom />
            </div>
            <div>
              <TextareaAutosize
                minRows={2.5}
                placeholder="type your comment here..."
                value={Comment}
                onChange={onTextChange}
                className={classes.commenttextarea}
              />
              <Button
                variant="outlined"
                onClick={() => (Comment.trim() ? addComment(Comment) : null)}
                className={classes.btn + " " + classes.addbtn}
              >
                Add
              </Button>
            </div>
          </Box>
        ) : null}
        <Fab
          onClick={() => {
            setIsCommentBoxOpen(!IsCommentBoxOpen);
          }}
          sx={{ margin: "10px", float: "right" }}
        >
          {IsCommentBoxOpen ? <CloseIcon /> : <CommentIcon />}
        </Fab>
      </div>
    </>
  );
}

export default Comments;
