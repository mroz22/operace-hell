import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

class Auth extends Component {
  async authFacebook(e) {
    e.preventDefault();
    let response;
    try {
      window.location.href = '/api/auth/facebook';
      console.log(response);
    } catch(err) {
      console.log(err);
    }
  }
  render() {
    return (
    <div>
      <div>
        <a href="" onClick={this.authFacebook}>
          <FontAwesome name='facebook'/> Facebook
        </a>
      </div>

    </div>
    );
  }

}

export default Auth;
