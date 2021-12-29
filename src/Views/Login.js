import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  CssBaseline,
  Avatar,
  Button,
  Radio,
  Link,
  Typography,
  Grid,
  Container,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Nature } from "@mui/icons-material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ErrorMessage } from "@hookform/error-message";
import {
  getAuthCredentials,
  isAuthenticated,
  setAuthCredentials,
} from "../api/auth-utils";
import { API_ENDPOINTS } from "../api/endpoints";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../data/user/user-login";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const App = () => {
  const navigate = useNavigate();
  const { token, permissions } = getAuthCredentials();
  if (isAuthenticated({ token, permissions })) {
    navigate(API_ENDPOINTS.LOGIN);
  }

  const { mutate: login, isLoading: loading } = useLoginMutation();
  const [errorMsg, setErrorMsg] = React.useState("");

  const schema = yup
    .object({
      email: yup
        .string()
        .required("Email must be provided.")
        .email("Enter Valid Email."),
      password: yup.string().required("Password must be provided"),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = ({ email, password }) => {
    login(
      {
        variables: {
          email,
          password,
        },
      },
      {
        onSuccess: ({ data }) => {
          if (data?.token) {
            setAuthCredentials(data?.token, data?.permissions);
            navigate(API_ENDPOINTS.DASHBOARD);
            setErrorMsg("form:error-enough-permission");
          } else {
            setErrorMsg("form:error-credential-wrong");
          }
        },
        onError: (error) => {
          setErrorMsg(error?.response?.data?.message);
        },
      }
    );
  };

  const classes = useStyles();

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <Nature />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
              )}
            />
            <ErrorMessage
              errors={errors}
              name="email"
              render={({ message }) => <p>{message}</p>}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
              )}
            />
            <ErrorMessage
              errors={errors}
              name="password"
              render={({ message }) => <p>{message}</p>}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Controller
              name="remember"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControlLabel
                  {...field}
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
              )}
            />
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </>
  );
};

export default App;
