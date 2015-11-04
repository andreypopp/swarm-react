import Swarm from 'swarm';

export default Swarm.Model.extend('Mouse', {
  defaults: {
    name: 'Mickey',
    x: 0,
    y: 0
  }
});
