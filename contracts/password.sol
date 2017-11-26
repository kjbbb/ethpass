pragma solidity ^0.4.18;

contract PasswordManager
{
    mapping (address => string) public data;
    mapping (address => uint) public saveCount;
    
    address[] public owners;

    uint256 public total;

    event PasswordSaved(address, string);
    event FundsWithdrawn(address, uint256 amount);

    function PasswordManager() public {
        //owner = msg.sender;
        owners = [
            msg.sender,
            0xffcf8fdee72ac11b5c542428b35eef5769c409f0,
            0x22d491bde2303f2f43325b2108d26f1eaba1e32b
        ];
    }
    
    modifier isOwner() {
        bool bIsOwner = false;
        for (uint i = 0; i < owners.length; i++) {
            if (msg.sender == owners[i]) {
                bIsOwner = true;
                _;
            }
        }
        require(bIsOwner);
    }

    function set(string _blob) public payable {
        //we should add a checksum so that we know the data coming in isn't corrupt
        if (bytes(data[msg.sender]).length != 0) {
            delete data[msg.sender];
        }

        data[msg.sender] = _blob;
        saveCount[msg.sender]++;

        total += msg.value;
    }

    function get() constant public returns (string) {
        return data[msg.sender];
    }

    function del() public {
        if (bytes(data[msg.sender]).length != 0) {
            delete data[msg.sender];
        }
    }

    function withdraw() isOwner public {
        msg.sender.transfer(total);
        FundsWithdrawn(msg.sender, total);
        total = 0;
    }
}
