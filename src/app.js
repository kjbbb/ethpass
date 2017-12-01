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
        if (confirm("Are you sure?") && this.passwordA.length) {
            if (this.selected == this.passwordA.length - 1) {
                this.selected = this.selected - 1;
            }
            this.passwordA.splice(this.selected, 1);
        }
    }
}

class PasswordForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            username: '',
            password: '',
            notes: '',
            ctime: Date.now(),
            mtime: Date.now()
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleNotesChange = this.handleNotesChange.bind(this);

        this.getData = this.getData.bind(this);
    }

    handleNameChange(e) {
        this.setState({name: e.target.value});
    }

    handleUsernameChange(e) {
        this.setState({username: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    handleNotesChange(e) {
        this.setState({notes: e.target.value});
    }

    getData() {
        let pw = Object.assign({}, this.state);
        pw.ctime = Date.now();
        pw.mtime = Date.now();
        return pw;
    }

    render() {
        return (
        <Form horizontal>
            <FormGroup controlId="formHorizontalName">
            <Col componentClass={ControlLabel} sm={3}>
            Name
            </Col>
            <Col sm={9}>
                <FormControl type="name" placeholder="Name"
                             value={this.state.name}
                             onChange={this.handleNameChange} />
            </Col>
            </FormGroup>
            <FormGroup controlId="formHorizontalUsername">
                <Col componentClass={ControlLabel} sm={3}>
                Username or Email
                </Col>
                <Col sm={9}>
                    <FormControl type="username" placeholder="Username or Email"
                                 value={this.state.username}
                                 onChange={this.handleUsernameChange}/>
                </Col>
            </FormGroup>
            <FormGroup controlId="formHorizontalPassword">
                <Col componentClass={ControlLabel} sm={3}>
                Password
                </Col>
                <Col sm={9}>
                    <FormControl type="password" placeholder="Password"
                                 value={this.state.password}
                                 onChange={this.handlePasswordChange}/>
                </Col>
            </FormGroup>
            <FormGroup controlId="formControlsHorizontalTextarea">
                <Col componentClass={ControlLabel} sm={3}>
                    <ControlLabel>Notes</ControlLabel>
                </Col>
                <Col sm={9}>
                    <FormControl componentClass="textarea" placeholder="Notes"
                                 value={this.state.notes}
                                 onChange={this.handleNotesChange}/>
                </Col>
            </FormGroup>
        </Form>);
    }
}

@observer
class AddPasswordModal extends React.Component
{
    constructor(props) {
        super(props);

        this.fnAddPassword = this.fnAddPassword.bind(this);
        this.fnClosePwModal = this.fnClosePwModal.bind(this);
    }

    fnClosePwModal() {
        this.props.store.showAddModal = false;
    }

    fnAddPassword() {
        let pw = this.passwordForm.getData();
        this.props.store.passwordA.push(pw);
        this.fnClosePwModal();
        this.props.store.selected =
            this.props.store.passwordA.length - 1;
    }

    render() {
        return (
        <Modal show={this.props.store.showAddModal}
               onHide={this.fnClosePwModal}>
            <Modal.Header closeButton>
               <Modal.Title>Add Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <PasswordForm ref={(inst) => {this.passwordForm = inst}} />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.fnAddPassword}>Add Password</Button>
                {' '}
                <Button onClick={this.fnClosePwModal}>Close</Button>
            </Modal.Footer>
        </Modal>);
    }
}

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

    let ctime = (new Date(pw.ctime)).toString();
    let mtime = (new Date(pw.mtime)).toString();

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
              <p>{ctime}</p>
              <p>{mtime}</p>
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
        ctime: Date.now(),
        mtime: Date.now(),
        notes: 'some notes here'
    });

    store.passwordA.push({
        name: 'second',
        username: 'memers',
        password: 'suprb0',
        ctime: Date.now(),
        mtime: Date.now(),
        notes: 'ayy more notes'
    });

    store.passwordA.push({
        name: 'feels',
        username: 'good',
        password: 'man',
        ctime: Date.now(),
        mtime: Date.now(),
        notes: 'so many memes'
    });

    ReactDOM.render(<SidebarView store={store} />, document.getElementById("sidebar"));
    ReactDOM.render(<CenterpaneView store={store} />, document.getElementById("centerpane"));
    ReactDOM.render(<ActionButtons store={store} />, document.getElementById("actionbuttons"));
}
