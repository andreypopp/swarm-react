/**
 * @copyright 2015, Andrey Popp <8mayday@gmail.com>
 */

import autobind from 'autobind-decorator';
import React from 'react'

export default function SwarmContainer(Component, listen) {

  return class extends React.Component {

    static defaultProps = Component.defaultProps;

    constructor(props) {
      super(props);
      this.state = {data: {}};
      this.models = listen(props);
      this.subscriptions = {};

      this._subscribe(this.models, this.subscriptions);
    }

    render() {
      let {data} = this.state;
      return <Component data={data} />;
    }

    componentWillUnmount() {
      this._unsubscribe(this.models, this.subscriptions);
      this.models = null;
      this.subscriptions = null;
    }

    componentWillReceiveProps(nextProps) {
      let nextModels = listen(nextProps);
      this._reconcile(this.models, nextModels, this.subscriptions);
      this.models = nextModels;
    }

    _reconcile(prevModels, nextModels, subscriptions) {
      for (let key in prevModels) {
        if (!prevModels.hasOwnProperty(key)) {
          continue;
        }
        // Key is absent from new listen spec.
        if (nextModels[key] == null) {
          prevModels[key].off(subscriptions[key]);
          subscriptions[key] = null;
        // Key is present but references a model with new identity.
        } else if (nextModels[key]._id !== prevModels[key]._id) {
          prevModels[key].off(subscriptions[key]);
          subscriptions[key] = null;
        }
      }
      for (let key in nextModels) {
        if (!nextModels.hasOwnProperty(key)) {
          continue;
        }
        // Only subscribe if we are not yet subscribed.
        if (subscriptions[key] == null) {
          let onChange = subscriptions[key] = this._onChange.bind(this, key);
          nextModels[key].on(onChange);
        }
      }
    }

    _subscribe(models, subscriptions) {
      for (let key in models) {
        if (!models.hasOwnProperty(key)) {
          continue;
        }
        let onChange = subscriptions[key] = this._onChange.bind(this, key);
        models[key].on(onChange);
      }
    }

    _unsubscribe(models, subscriptions) {
      for (let key in subscriptions) {
        if (!subscriptions.hasOwnProperty(key)) {
          continue;
        }
        models[key].off(subscriptions[key]);
      }
    }

    _onChange(key, spec, value, source) {
      let {data} = this.state;
      this.setState({
        data: {...data, [key]: value}
      });
    }

  };
}
