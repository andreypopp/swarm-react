import React from 'react';
import ReactDOM from 'react-dom';
import Swarm from 'swarm';
import {SwarmContainer} from '../src';

import Mouse from './Mouse';

let host = new Swarm.Host('unique_client_id');

host.connect('ws://localhost:3000/');

class MouseTracker extends React.Component {

  render() {
    let {data} = this.props;
    return (
      <div>
        {JSON.stringify(data.mouse)}
      </div>
    );
  }
}

MouseTracker = SwarmContainer(
  MouseTracker,
  function listen(props) {
    return {
      mouse: new Mouse(props.id)
    };
  });

ReactDOM.render(
  <MouseTracker id="Mickey" />,
  document.getElementById('app')
);
