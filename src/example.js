import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Link,
  Redirect,
  useHistory,
  useLocation,
  useRouteMatch,
  useParams
} from "react-router-dom";

// This example has 3 pages: a public page, a protected
// page, and a login screen. In order to see the protected
// page, you must first login. Pretty standard stuff.
//
// First, visit the public page. Then, visit the protected
// page. You're not yet logged in, so you are redirected
// to the login page. After you login, you are redirected
// back to the protected page.
//
// Notice the URL change each time. If you click the back
// button at this point, would you expect to go back to the
// login page? No! You're already logged in. Try it out,
// and you'll see you go back to the page you visited
// just *before* logging in, the public page.

export default function AuthExample() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authenticate = (cb) => {
    setTimeout(() => {
      setIsAuthenticated(true);
      cb && cb();
    }, 100);
  };
  const signout = (cb) => {
    setTimeout(() => {
      setIsAuthenticated(false);
      cb();
    }, 100);
  };
  return (
    <Router>
      <div>
        <AuthButton isAuthenticated={isAuthenticated} signout={signout} />
        <ul>
          <li>
            <Link to="/public">Public Page</Link>
          </li>
          <li>
            <Link to="/protected">Protected Page</Link>
          </li>
        </ul>

        <Switch>
          <Route path="/public">
            <PublicPage />
          </Route>
          <Route path="/login">
            <LoginPage authenticate={authenticate} />
          </Route>
          <PrivateRoute path="/protected" isAuthenticated={isAuthenticated}>
            <ProtectedPage />
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
  );
}

function AuthButton({ isAuthenticated: isLogged, signout }) {
  let history = useHistory();
  const [isAuthenticated, setIsAuthenticated] = useState(isLogged);
  useEffect(() => {
    setIsAuthenticated(isLogged);
  }, [isLogged]);
  return isAuthenticated ? (
    <p>
      Welcome!{" "}
      <button
        onClick={() => {
          signout(() => history.push("/"));
        }}
      >
        Sign out
      </button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  );
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, isAuthenticated, ...rest }) {
  console.log("private route");
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

function PublicPage() {
  return <h3>Public</h3>;
}

function ProtectedPage() {
  return <h3>Protected</h3>;
}

function LoginPage({ authenticate }) {
  let location = useLocation();
  let { path, url } = useRouteMatch();

  let { from } = location.state || { from: { pathname: "/" } };
  return (
    <div>
      <ul>
        <li>
          <NavLink to={`${url}/github`}>Login with Github</NavLink>
        </li>
        <li>
          {" "}
          <NavLink to={`${url}/facebook`}>Login with Facebook</NavLink>
        </li>
      </ul>
      <p>You must log in to view the page at {from.pathname}</p>
      <Switch>
        <Route path={`${path}/github`}>
          <GithubLogin authenticate={authenticate} />
        </Route>
        <Route path={`${path}/facebook`} from={from}>
          <FacebookLogin authenticate={authenticate} />
        </Route>
      </Switch>
    </div>
  );
}

function GithubLogin({ authenticate }) {
  const history = useHistory();
  return (
    <button
      onClick={() => {
        authenticate(() => {
          history.go(-1);
          history.replace("/protected");
        });
      }}
    >
      Login with Github
    </button>
  );
}
function FacebookLogin({ authenticate }) {
  const history = useHistory();

  return (
    <button
      onClick={() => {
        authenticate(() => {
          history.go(-1);
          history.replace("/protected");
        });
      }}
    >
      Login with Facebook
    </button>
  );
}
