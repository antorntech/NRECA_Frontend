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
import AddLeave from "./pages/AddLeave";
import Accounts from "./pages/Accounts";
import AddAccounts from "./pages/AddAccounts";
import EditAccounts from "./pages/EditAccounts";
import EditLeave from "./pages/EditLeave";
import MyLeave from "./pages/MyLeave";
import AddMyLeave from "./pages/AddMyLeave";
import EditMyLeave from "./pages/EditMyLeave";
import DocumentsCV from "./pages/DocumentsCV";
import AddDocumentsCV from "./pages/AddDocumentsCV";
import EditDocumentsCV from "./pages/EditDocumentsCV";
import FormTemplate from "./pages/FormTemplate";
import AddFormTemplate from "./pages/AddFormTemplate";
import EditFormTemplate from "./pages/EditFormTemplate";

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
            <Route exact path="/documentscv" component={DocumentsCV} />
            <Route exact path="/add_documentscv" component={AddDocumentsCV} />
            <Route
              exact
              path="/edit_documentscv/:id"
              component={EditDocumentsCV}
            />
            <Route exact path="/formtemplate" component={FormTemplate} />
            <Route exact path="/add_formtemplate" component={AddFormTemplate} />
            <Route
              exact
              path="/edit_formtemplate/:id"
              component={EditFormTemplate}
            />
            <Route exact path="/view_employee/:id" component={ViewEmployee} />
            <Route exact path="/leaves" component={Leave} />
            <Route exact path="/my_leave" component={MyLeave} />
            <Route exact path="/edit_my_leave/:id" component={EditMyLeave} />
            <Route exact path="/add_leave" component={AddLeave} />
            <Route exact path="/add_my_leave" component={AddMyLeave} />
            <Route exact path="/edit_leave/:id" component={EditLeave} />
            <Route exact path="/accounts" component={Accounts} />
            <Route exact path="/add_accounts" component={AddAccounts} />
            <Route exact path="/edit_accounts/:id" component={EditAccounts} />
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
