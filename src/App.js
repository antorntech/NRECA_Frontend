import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import "antd/dist/antd.min.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditEmployeeDetails from "./pages/EditEmployeeDetails";
import AddEmployee from "./pages/AddEmployee";
import Employee from "./pages/Employee";
import ViewEmployee from "./pages/ViewEmployee";
import Leave from "./pages/Leave";

function App() {
  const user = JSON.parse(localStorage.getItem("token"));
  return (
    <div className="App">
      {user ? (
        <Switch>
          <Main>
            <Route exact path="/dashboard" component={Home} />
            <Route exact path="/employee" component={Employee} />
            <Route exact path="/add_employee" component={AddEmployee} />
            <Route
              exact
              path="/edit_employee/:id"
              component={EditEmployeeDetails}
            />
            <Route exact path="/view_employee/:id" component={ViewEmployee} />
            <Route exact path="/leaves" component={Leave} />
            <Redirect from="*" to="/dashboard" />
          </Main>
        </Switch>
      ) : (
        <Switch>
          <Route path="/sign-in" exact component={SignIn} />
          <Redirect from="*" to="/sign-in" />
        </Switch>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
