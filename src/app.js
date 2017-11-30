//var encrypt = require('./encrypt.js');
//var contract = require('./contract.js');

import React from 'react';
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import {observable, action} from 'mobx';
import {Button, Modal, Form, FormControl, FormGroup, Col, Checkbox, ControlLabel} from 'react-bootstrap';
import classnames from 'classnames';

//var RBS = require('react-bootstrap');
//var Button = RBS.Button;

class Store {
    @observable passwordA = [];
    @observable selected = 2;

    @observable showAddModal = false;

    @action deleteSelected = () => {
        if (this.passwordA.length) {
            if (this.selected == this.passwordA.length - 1) {
                this.selected = this.selected - 1;
                console.log('hit');
            }
            this.passwordA.splice(this.selected, 1);
        }
    }
}

const AddPasswordModal = observer(({store}) => {

    let fnClosePwModal = () => {
        store.showAddModal = false;
    }

    return (
    <Modal show={store.showAddModal}
           onHide={fnClosePwModal}>
        <Modal.Header closeButton>
           <Modal.Title>Add Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
			<Form horizontal>
			    <FormGroup controlId="formHorizontalName">
			    <Col componentClass={ControlLabel} sm={3}>
			    Name
			    </Col>
			    <Col sm={9}>
			        <FormControl type="name" placeholder="Name" />
			    </Col>
			    </FormGroup>
                <FormGroup controlId="formHorizontalUsername">
                    <Col componentClass={ControlLabel} sm={3}>
                    Username or Email
                    </Col>
                    <Col sm={9}>
                        <FormControl type="username" placeholder="Username or Email" />
			        </Col>
			    </FormGroup>
			    <FormGroup controlId="formHorizontalPassword">
			        <Col componentClass={ControlLabel} sm={3}>
			        Password
			        </Col>
			        <Col sm={9}>
			            <FormControl type="password" placeholder="Password" />
			        </Col>
			    </FormGroup>
			    <FormGroup controlId="formControlsHorizontalTextarea">
			        <Col componentClass={ControlLabel} sm={3}>
			            <ControlLabel>Notes</ControlLabel>
			        </Col>
			        <Col sm={9}>
			            <FormControl componentClass="textarea" placeholder="Notes" />
			        </Col>
			    </FormGroup>
			</Form>
        </Modal.Body>
        <Modal.Footer>
            <Button>Add Password</Button>
			{' '}
            <Button onClick={fnClosePwModal}>Close</Button>
        </Modal.Footer>
    </Modal>);
});

const ActionButtons = observer(({store}) => {

    let fnOpenPwModal = () => {
        store.showAddModal = true;
    }

    return (
    <div>
        <button className="btn btn-default"
                onClick={fnOpenPwModal}>+ add password</button>{' '}
        <button className="btn btn-default">+ sync to blockchain</button>{' '}
        <button className="btn btn-default">+ download your data</button>{' '}
        <AddPasswordModal store={store} />
    </div>
    );
});

const SidebarView = observer(({store}) => {

    let fnSelect = (idx) => {
        store.selected = idx;
    }

    let pwA = store.passwordA.map((pw, idx) => {
        let cnames = (idx == store.selected) ? classnames('bg-dark') : null;
        return (
            <tr
                key={idx}
                onClick={fnSelect.bind(this, idx)}
                className={cnames}>
              <th scope="row"></th>
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

    if (!store.passwordA[store.selected]) {
        return <div>zerostate</div>;
    }

    let pw = store.passwordA[store.selected];

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
        <button className="btn btn-default">update</button>{' '}
        <button className="btn btn-danger" onClick={store.deleteSelected}>delete</button>
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
    ReactDOM.render(<ActionButtons store={store} />, document.getElementById("actionbuttons"));
}
