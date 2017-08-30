import React, { Component } from 'react';
import Table from '../table/Table';

let response = {};

class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: []
    };
  }
  async componentDidMount() {

    try {
      response = await fetch('users', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        }});
      response = await response.json();
      console.log(response.data);
      this.setState({users: response.data});
      console.log(this.state.users);
    } catch(err) {
      console.log(err);
    }
  }

  render() {
    let users = this.state.users;
    if (!users || users.length === 0) {
      return (
      <div>no users</div>
      );
    } else {
      return (
      <div>
        <Table
        showPagination ={false}
        data={this.state.users}
        columns={[{
        Header: 'jmeno',
        accessor: 'name'
        }]}
        />
      </div>
      );
    }


  }
}

export default Users;
