import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import Page from './components/page/Page';
import Users from './components/pages/Users';

import { Grid, Row, Col, Navbar, Nav, NavItem} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import Auth from './components/auth/Auth';

const routes = [{
  path: '/',
  exact: true,
  main: () => <h2>Operace hell.sh</h2>
}, {
  path: '/players',
  main: () => <Users />
}, {
  path: '/auth',
  main: () => <Auth />
}];

class App extends Component {
  render() {
    return (
    <div >
      <Grid>
        <Router>
          <div>
            <Navbar collapseOnSelect>
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="/">Title</a>
                </Navbar.Brand>
                <Navbar.Toggle />
              </Navbar.Header>
              <Navbar.Collapse>
                <Nav>
                  <NavItem>
                    <Link to="/players">Hráči</Link>
                  </NavItem>
                </Nav>
                <Nav pullRight>
                  <NavItem>
                    <Link to="/auth">
                      <FontAwesome name="lock"/> Přihlášení
                    </Link>
                  </NavItem>
                </Nav>
              </Navbar.Collapse>
            </Navbar>


            <Row>
              <Col xs={12}>
                {routes.map((route, index) => (
                <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.main}
                />
                ))}

              </Col>

            </Row>

          </div>
        </Router>


      </Grid>

    </div>

    );
  }
}


// Each logical "route" has two components, one for
// the sidebar and one for the main area. We want to
// render both of them in different places when the
// path matches the current URL.




export default App;
