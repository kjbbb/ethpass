pragma solidity ^0.4.18;

contract PasswordManager
{
    mapping (address => bytes) data;
    address owner;

    function PasswordManager() public {
        owner = msg.sender;
    }

    function set(bytes _blob) public {
        //we should add a checksum so that we know the data coming in isn't corrupt
        data[msg.sender] = _blob;
    }

    function get() constant public returns (bytes) {
        return data[msg.sender];
    }
}
