//var encrypt = require('./encrypt.js');
//var contract = require('./contract.js');

import React from 'react';
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import {observable, action} from 'mobx';
import {Button, Modal, Form, FormControl, FormGroup, Row, Col, Checkbox, ControlLabel, ProgressBar} from 'react-bootstrap';
import classnames from 'classnames';
import zxcvbn from 'zxcvbn';
import pwgen from 'generate-password';
import contract from './contract.js';
import aesjs from 'aes-js';
import createHistory from 'history/createBrowserHistory';

class Store
{
    constructor() {
        setTimeout(() => {
            this.contract = contract.load();
            this.load();
        }, 100);
    }

    @observable passwordA = [];
    @observable selected = 2;
    @observable aes256key = 0;

    @observable showAddModal = false;

    @action deleteSelected = () => {
        if (confirm("Are you sure?") && this.passwordA.length) {
            if (this.selected == this.passwordA.length - 1) {
                this.selected = this.selected - 1;
            }
            this.passwordA.splice(this.selected, 1);
        }
    }

    @action sync = () => {
        let json = JSON.stringify(this.passwordA);
        let trxnOpt = {gas: '2000000', gasPrice: '4000000000'};
        this.contract.set(json, trxnOpt, (err, res) => {
            console.log(err, res);
        });
    }

    @action load = () => {
        this.contract.get((err, res) => {
            if (!err) {
                try {
                    let pwA = JSON.parse(res);
                    this.passwordA = pwA;
                }
                catch (e) {
                    this.passwordA = [];
                    //todo display error
                }
            }
        });
    }

    @action signIn = () => {
        const hex = web3.fromUtf8('CryptoPass');
        web3.personal.sign(hex, web3.eth.accounts[0], (err, result) => {
            if (!err) {
                const aeshex = result.substr(2).substr(0, 32);
                this.aes256key = aesjs.utils.utf8.toBytes(aeshex);
            }
        });
    }
}

class PasswordGenerator extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            strength: -1,
            numbers: true,
            symbols: false,
            uppercase: false
        }

        this.handleInputChange = this.handleInputChange.bind(this);

        this.pwGen = this.pwGen.bind(this);
    }

    pwGen() {
        let pw = pwgen.generate({
            length: 12,
            numbers: this.state.numbers,
            uppercase: this.state.uppercase,
            symbols: this.state.symbols
        });

        let state = this.state;
        state.strength = zxcvbn(pw).score;
        this.setState(state);

        this.props.setPassword(pw);
    }

    handleInputChange(e) {
        let s = this.state;
        s[e.target.name] = e.target.checked;
        this.setState(s);
    }

    render() {

        let score_to_str = [
            'weak',
            'okay',
            'good',
            'strong',
            'very strong'
        ];
        score_to_str[-1] = '';

        return (
        <div>
            <p><small>password strength: {score_to_str[this.state.strength]}</small></p>
            <ProgressBar now={this.state.strength / 4.0 * 100.0} />
            {' '}
            <Button bsSize="xsmall"
                    onClick={this.pwGen}>Generate password</Button>{' '}
                <Checkbox inline checked={this.state.numbers} name="numbers"
                        onChange={this.handleInputChange}><small>numbers</small></Checkbox>
                <Checkbox inline checked={this.state.uppercase} name="uppercase"
                        onChange={this.handleInputChange}><small>uppercase</small></Checkbox>
                <Checkbox inline checked={this.state.symbols} name="symbols"
                        onChange={this.handleInputChange}><small>symbols</small></Checkbox>
        </div>);
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

        this.handleInputChange = this.handleInputChange.bind(this);

        this.getData = this.getData.bind(this);

        this.setPassword = this.setPassword.bind(this);
    }

    handleInputChange(e) {
        let state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    }

    getData() {
        let pw = Object.assign({}, this.state);
        pw.ctime = Date.now(); //fixme why
        pw.mtime = Date.now();
        return pw;
    }

    setPassword(pw) {
        let state = this.state;
        state.password = pw;
        this.setState(state);
    }

    render() {

        return (
        <Form horizontal>
            <FormGroup controlId="formHorizontalName">
            <Col componentClass={ControlLabel} sm={3}>
            Name
            </Col>
            <Col sm={9}>
                <FormControl name="name" type="text" placeholder="Name"
                             value={this.state.name}
                             onChange={this.handleInputChange} />
            </Col>
            </FormGroup>
            <FormGroup controlId="formHorizontalUsername">
                <Col componentClass={ControlLabel} sm={3}>
                Username or Email
                </Col>
                <Col sm={9}>
                    <FormControl name="username" type="text"
                                 placeholder="Username or Email"
                                 value={this.state.username}
                                 onChange={this.handleInputChange}/>
                </Col>
            </FormGroup>
            <FormGroup controlId="formHorizontalPassword">
                <Col componentClass={ControlLabel} sm={3}>
                Password
                </Col>
                <Col sm={9}>
                    <FormControl name="password" type="text"
                                 placeholder="Password"
                                 value={this.state.password}
                                 onChange={this.handleInputChange}/>
                </Col>
            </FormGroup>
            <Row>
                <Col sm={3}></Col>
                <Col sm={9}>
                    <PasswordGenerator setPassword={this.setPassword}/>
                </Col>
            </Row>
            <br />
            <FormGroup controlId="formControlsHorizontalTextarea">
                <Col componentClass={ControlLabel} sm={3}>
                    <ControlLabel>Notes</ControlLabel>
                </Col>
                <Col sm={9}>
                    <FormControl componentClass="textarea" placeholder="Notes"
                                 name="notes"
                                 value={this.state.notes}
                                 onChange={this.handleInputChange}/>
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

        if (!pw.username || !pw.password) {
            return false;
        }

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

	let fnSync = () => {
        store.sync();
	}

    if (store.passwordA.length == 0) {
        return <h1>&nbsp;</h1>
    }

    return (
    <div>
        <button className="btn btn-default"
                onClick={fnOpenPwModal}>+ add password</button>{' '}
        <button className="btn btn-default"
                onClick={fnSync}>+ sync to blockchain</button>{' '}
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

class PasswordView extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            show: false,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    //set show to false when the password changes
    componentWillReceiveProps(nextProps) {
        this.setState((prevState) => ({
            show: false
        }));
    }

    handleClick() {
        this.setState((prevState) => ({
            show: true
        }));
    }

    render() {
        if (this.state.show) {
            return this.props.password;
        }
        else {
            return <a onClick={this.handleClick}>click to show</a>;
        }
    }
}

const CenterpaneView = observer(({store}) => {

    if (!store.passwordA[store.selected]) {
        return (
            <div className="text-center">
                <Button onClick={store.signIn}>Sign into CryptoPass</Button>
            </div>);
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
              <p><PasswordView password={pw.password} /></p>
              <p>{ctime}</p>
              <p>{mtime}</p>
              <p>{pw.notes}</p>
            </div>
          </div>
        </div>
        <br />
      <div className="text-center">
        <button className="btn btn-default" onClick={store.editSelected}>Edit</button>{' '}
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

    //store.passwordA.push({
    //    name: 'lol',
    //    username: 'memes',
    //    password: 'nyancat',
    //    ctime: Date.now(),
    //    mtime: Date.now(),
    //    notes: 'some notes here'
    //});

    //store.passwordA.push({
    //    name: 'second',
    //    username: 'memers',
    //    password: 'suprb0',
    //    ctime: Date.now(),
    //    mtime: Date.now(),
    //    notes: 'ayy more notes'
    //});

    //store.passwordA.push({
    //    name: 'feels',
    //    username: 'good',
    //    password: 'man',
    //    ctime: Date.now(),
    //    mtime: Date.now(),
    //    notes: 'so many memes'
    //});

    ReactDOM.render(<SidebarView store={store} />, document.getElementById("sidebar"));
    ReactDOM.render(<CenterpaneView store={store} />, document.getElementById("centerpane"));
    ReactDOM.render(<ActionButtons store={store} />, document.getElementById("actionbuttons"));
}
