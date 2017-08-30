import React, { Component } from 'react';

class Page extends Component {
  async componentDidMount () {
    try {
      let data = await fetch('users');
    } catch(err) {
      console.log(err);
    }
  }

  render() {
    return (
    <div>

    </div>
    );
  }
}

export default Page;
