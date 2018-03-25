/* global window, localStorage */
/* eslint jsx-a11y/anchor-is-valid: 0 */
/* eslint prefer-destructuring: 0 */

import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'material-ui/SvgIcon';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import MenuIcon from 'material-ui-icons/Menu';
import HomeIcon from 'material-ui-icons/Home';
import ProtectedIcon from 'material-ui-icons/LockOutline';
import LoginIcon from 'material-ui-icons/ExitToApp';
import LogoutIcon from 'material-ui-icons/Close';

import Identicons from '../../libs/identicons-react/index';

import Logo from '../../img/svg/Logo';

import './styles/Topbar.css';

class Topbar extends Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: null, width: 0 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.checkAuthentication();
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth });
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };


  render() {
    if (this.state.authenticated === null) return null;

    let clientId;

    if (localStorage.getItem('okta-token-storage') && localStorage.getItem('okta-token-storage') !== '{}') {
      clientId = JSON.parse(localStorage.getItem('okta-token-storage')).idToken.clientId;
      // console.log(clientId);
    }

    return (
      <div className="topBarContainer">
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton color="inherit" aria-label="Logo">
              <SvgIcon>
                <Logo />
              </SvgIcon>
            </IconButton>
            <Typography variant="title" color="inherit" className="flex">
              Valparaiso
            </Typography>

            <div className="topBarLinks" style={{ display: this.state.width >= 600 ? 'block' : 'none' }}>
              <Link to="/">Home</Link>

              {this.state.authenticated ?
                <Fragment>
                  <Link to="/protected">Protected</Link>
                  <a onClick={this.props.auth.logout} role="Link">Logout</a>
                </Fragment>
                :
                <Fragment>
                  {/* <Link to="/signup">Inscription</Link> */}
                  <a onClick={this.props.auth.login} role="Link">Login</a>
                </Fragment>
              }
            </div>

            <div className="topBarMenuButton" style={{ display: this.state.width < 600 ? 'block' : 'none' }}>
              <IconButton onClick={this.toggleDrawer('left', true)}>
                <MenuIcon />
              </IconButton>
            </div>

            { clientId &&
            <div className="topbarLoggedUser">
              <Identicons id={clientId} width={20} size={3} />
            </div>
            }

            <Drawer anchor="left" open={this.state.left} onClose={this.toggleDrawer('left', false)}>
              <div
                tabIndex={0}
                role="button"
                onClick={this.toggleDrawer('left', false)}
                onKeyDown={this.toggleDrawer('left', false)}
                className="list"
              >
                <List>
                  <Link to="/">
                    <ListItem>
                      <ListItemIcon>
                        <HomeIcon />
                      </ListItemIcon>
                      <ListItemText primary="Home" />
                    </ListItem>
                  </Link>
                  <Divider />

                  {this.state.authenticated ?
                    <Fragment>
                      <Link to="/protected">
                        <ListItem>
                          <ListItemIcon>
                            <ProtectedIcon />
                          </ListItemIcon>
                          <ListItemText primary="Protected" />
                        </ListItem>
                      </Link>
                      <Divider />
                      <a onClick={this.props.auth.logout} role="Link">
                        <ListItem>
                          <ListItemIcon>
                            <LogoutIcon />
                          </ListItemIcon>
                          <ListItemText primary="Logout" />
                        </ListItem>
                      </a>
                    </Fragment>
                    :
                    <Fragment>
                      {/* <ListItem><Link to="/signup">Inscription</Link></ListItem> */}
                      <Divider />
                      <a onClick={this.props.auth.login} role="Link">
                        <ListItem>
                          <ListItemIcon>
                            <LoginIcon />
                          </ListItemIcon>
                          <ListItemText primary="Login" />
                        </ListItem>
                      </a>
                    </Fragment>
                  }
                </List>
              </div>
            </Drawer>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withAuth(Topbar);
