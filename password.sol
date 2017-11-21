pragma solidity ^0.4.18;

contract PasswordManager
{
    mapping (address => string) data;
    address owner;

    function PasswordManager() public {
        owner = msg.sender;
    }

    function set(string _blob) public {
        //we should add a checksum so that we know the data coming in isn't corrupt
        data[msg.sender] = _blob;
    }

    function get() constant public returns (string) {
        return data[msg.sender];
    }
}
