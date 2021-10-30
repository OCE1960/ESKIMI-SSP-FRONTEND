import React, { Suspense} from 'react';
import { lazy  } from "@loadable/component";
import axios from 'axios';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Container from "./components/containers/Container";
import { Spinner } from './components/Spinner';

const Home = lazy(() => import("./pages/Home"));
const Create = lazy(() => import("./pages/Create"));
const Edit = lazy(() => import("./pages/Edit"));

const App: React.FC = () => {
  axios.defaults.baseURL = 'http://localhost/api/v1';
  axios.defaults.withCredentials = true;
  return (
    <Router>
        <Suspense fallback={Spinner}>

          <Switch>

            <Route exact path={["/", "/new","/edit/:id"]}>
                 <Container>
                    <Switch> 
                        <Route exact path="/">
                          <Home />
                        </Route>
                        <Route exact path="/new">
                          <Create />
                        </Route>

                        <Route exact path="/edit/:id">
                          <Edit />
                        </Route>
                    </Switch>
                  </Container>
            </Route>

            <Redirect from="*" to="/"  />
            
          </Switch>

        </Suspense>
    </Router>
  );
}

export default App;
