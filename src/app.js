//var encrypt = require('./encrypt.js');
//var contract = require('./contract.js');

import React from 'react';
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import {observable, action} from 'mobx';
import {Button} from 'react-bootstrap';
import classNames from 'classnames';

//var RBS = require('react-bootstrap');
//var Button = RBS.Button;

const ActionButtons = (
  <div className="">
    <button className="btn btn-default">+ add password</button>
    <button className="btn btn-default">+ sync to blockchain</button>
    <button className="btn btn-default">+ download your data</button>
  </div>
);

class Store {
    @observable passwordA = [];
    @observable selected = 0;
}

const SidebarView = observer(({store}) => {

    let fnSelect = (idx) => {
        store.selected = idx;
        console.log(idx);
    }

    let pwA = store.passwordA.map((pw, idx) => {
        return (
            <tr key={idx} onClick={fnSelect.bind(this, idx)}><th scope="row"></th>
              <td>
                <p className="nomargin"><strong>{pw.name}</strong></p>
                <p className="text-muted nomargin">{pw.username}</p>
              </td>
            </tr>
        );
    });

    return (
      <div>
        <br />
        <div><input type="text" className="form-control" placeholder="search"/></div>
        <br />
        <table className="table">
          <tbody>
            {pwA}
          </tbody>
        </table>
      </div>);
});

const CenterpaneView = observer(({store}) => {

    let pw = store.passwordA[store.selected];

    //we should use id here instead
    let fnDelete = (idx) => {
        store.passwordA.splice(idx, 1);
    }

    //todo, if store is empty, display zero state

    return (
    <div>
      <h2 className="text-center">{pw.name}</h2>
        <div className="container">
          <div className="row">
            <div className="col-xs-1"></div>
            <div className="col-xs-2 text-right">
              <p><strong>username or email</strong></p>
              <p><strong>password</strong></p>
              <p><strong>created on</strong></p>
              <p><strong>modified on</strong></p>
              <p><strong>notes</strong></p>
            </div>
            <div className="col-xs-9">
              <p>{pw.username}</p>
              <p>{pw.password}</p>
              <p>{pw.ctime}</p>
              <p>{pw.mtime}</p>
              <p>{pw.notes}</p>
            </div>
          </div>
        </div>
        <br />
      <div className="text-center">
        <button className="btn btn-default">update </button>
        <button className="btn btn-danger" onClick={fnDelete.bind(this, store.selected)}> delete</button>
      </div>
    </div>
    )
});

window.onload = () => {

    //let Contract = web3.eth.contract(contract.abi);
    //ContractInst = Contract.at(contract.address);

    let store = new Store();
    store.selected = 0;

    store.passwordA.push({
        name: 'lol',
        username: 'memes',
        password: 'nyancat',
        ctime: 'nov 1 2017',
        mtime: 'nov 1 2017',
        notes: 'some notes here'
    });

    store.passwordA.push({
        name: 'second',
        username: 'memers',
        password: 'suprb0',
        ctime: 'nov 2 2017',
        mtime: 'nov 2 2017',
        notes: 'ayy more notes'
    });

    store.passwordA.push({
        name: 'feels',
        username: 'good',
        password: 'man',
        ctime: 'nov 3 2017',
        mtime: 'nov 3 2017',
        notes: 'so many memes'
    });

    ReactDOM.render(<SidebarView store={store} />, document.getElementById("sidebar"));
    ReactDOM.render(<CenterpaneView store={store} />, document.getElementById("centerpane"));
    ReactDOM.render(ActionButtons, document.getElementById("actionbuttons"));
}
