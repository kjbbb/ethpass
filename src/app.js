var aes = require('aes-js');
var encrypt = require('./encrypt.js');
var contract = require('./contract.js');
var React = require('react');
var ReactDOM = require('react-dom');

var RBS = require('react-bootstrap');
var Button = RBS.Button;

const Sidebar = (
  <div>
    <br />
    <div><input type="text" className="form-control" placeholder="search"/></div>
    <br />
    <table className="table">
      <tbody>
        <tr><th scope="row"></th>
          <td>
            <p className="nomargin"><strong>gmail</strong></p>
            <p className="text-muted nomargin">lol@gmail.com</p>
          </td>
        </tr>
        <tr className="bg-dark">
          <th scope="row"></th>
          <td>
            <p className="nomargin"><strong>fastmail</strong></p>
            <p className="text-muted nomargin">lol@fastmail.com</p>
          </td>
        </tr>
        <tr>
          <th scope="row"></th>
          <td>
            <p className="nomargin"><strong>placeholder</strong></p>
            <p className="text-muted nomargin">lol@placeholder.com</p>
          </td>
        </tr>
        <tr>
          <th scope="row"></th>
          <td>
            <p className="nomargin"><strong>new</strong></p>
            <p className="text-muted nomargin">memes@memes.com</p>
          </td>
        </tr>
        <tr>
          <th scope="row"></th>
          <td>
            <p className="nomargin"><strong>new</strong></p>
            <p className="text-muted nomargin">memes@memes.com</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const Centerpane = (
  <div>
    <h2 className="text-center">fastmail</h2>
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
            <p>memes@memes.com</p>
            <p>nyancat</p>
            <p>nov 1 2017</p>
            <p>nov 1 2017</p>
            <p>
            some notes here
            </p>
          </div>
        </div>
      </div>
      <br />
    <div className="text-center">
      <button className="btn btn-default">update </button>
      <button className="btn btn-danger"> delete</button>
    </div>
  </div>
);

const ActionButtons = (
  <div className="">
    <button className="btn btn-default">+ add password</button>
    <button className="btn btn-default">+ sync to blockchain</button>
    <button className="btn btn-default">+ download your data</button>
  </div>
);

window.onload = () => {
    let Contract = web3.eth.contract(contract.abi);
    ContractInst = Contract.at(contract.address);

    ReactDOM.render(Sidebar, document.getElementById("sidebar"));
    ReactDOM.render(Centerpane, document.getElementById("centerpane"));
    ReactDOM.render(ActionButtons, document.getElementById("actionbuttons"));
}

