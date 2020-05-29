import React from "react";
import { useSignUpPageStyles } from "../styles";
import SEO from "../components/shared/Seo";
import {
  Card,
  CardHeader,
  TextField,
  Button,
  Typography,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { LoginWithFacebook } from "./login";
import { AuthContext } from "../auth";

function SignUpPage() {
  const classes = useSignUpPageStyles();
  const { signUpWithEmailAndPassword } = React.useContext(AuthContext);
  const [values, setValues] = React.useState({
    email: "",
    name: "",
    username: "",
    password: "",
  });
  const history = useHistory();

  function handleChange(e) {
    e.persist();
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await signUpWithEmailAndPassword(values);
    history.push("/");
  }

  return (
    <>
      <SEO title="Sign up" />
      <section className={classes.section}>
        <article>
          <Card className={classes.card}>
            <CardHeader className={classes.cardHeader} />
            <Typography className={classes.cardHeaderSubHeader}>
              Sing up to see photos and videos from your friends.
            </Typography>
            <LoginWithFacebook
              color="primary"
              iconColor="white"
              variant="contained"
            />
            <div className={classes.orContainer}>
              <div className={classes.orLine} />
              <div>
                <Typography varinat="body2" color="textSecondary">
                  OR
                </Typography>
              </div>
              <div className={classes.orLine} />
            </div>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                variant="filled"
                label="Email"
                type="email"
                margin="dense"
                className={classes.textField}
                onChange={handleChange}
                name="email"
              />
              <TextField
                fullWidth
                variant="filled"
                label="Full Name"
                margin="dense"
                className={classes.textField}
                onChange={handleChange}
                name="name"
              />
              <TextField
                fullWidth
                variant="filled"
                label="Username"
                margin="dense"
                className={classes.textField}
                autoComplete="username"
                onChange={handleChange}
                name="username"
              />
              <TextField
                fullWidth
                variant="filled"
                label="Password"
                margin="dense"
                type="password"
                className={classes.textField}
                autoComplete="new-password"
                onChange={handleChange}
                name="password"
              />
              <Button
                variant="contained"
                fullWidth
                className={classes.button}
                color="primary"
                type="submit"
              >
                Sign Up
              </Button>
              <Button color="secondary" fullWidth>
                <Typography variant="caption">Forgot password?</Typography>
              </Button>
            </form>
          </Card>
          <Card className={classes.loginCard}>
            <Typography align="right" variant="body2">
              Have an account?
            </Typography>
            <Link to="/accounts/login">
              <Button color="primary" className={classes.loginButton}>
                Log in
              </Button>
            </Link>
          </Card>
        </article>
      </section>
    </>
  );
}

export default SignUpPage;
