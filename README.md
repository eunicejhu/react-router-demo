This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

This project is forked from React-router demos. it's linked to sandbox as a playground.

It's used to fix bugs.

## Bugs

- [AuthButton is not updated](#Fix AuthButton)

## Fix AuthButton

> Note: Inject global object into Component does **NOT** provoke re-render
> Use state instead to persist data

```js
const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

function AuthButton() {
  let history = useHistory();

  return fakeAuth.isAuthenticated ? (
    <p>
      Welcome!{" "}
      <button
        onClick={() => {
          fakeAuth.signout(() => history.push("/"));
        }}
      >
        Sign out
      </button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  );
}
```

Below is the corrected version

```js
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
```
