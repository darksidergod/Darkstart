pragma solidity ^0.4.17;

contract campaignFactory{

    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address manager = msg.sender;
        address newCampaign = new Campaign(minimum, manager);
        deployedCampaigns.push(newCampaign);
    }
    function getDeployedCampaign() public view returns (address[]) {
        return deployedCampaigns;
    }
}


contract Campaign {

    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address =>bool) hasVoted;
    }

    modifier restricted(){
        require(msg.sender==manager);
        _;
    }



    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping (address => bool) public approvers;
    uint public approversCount;

    function Campaign(uint minimum, address creator) public{
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute()public payable{
        require(msg.value >= minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string description, uint value, address recipient)
    public restricted{

        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public{
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.hasVoted[msg.sender]);

        request.approvalCount++;
        request.hasVoted[msg.sender]=true;

    }

    function finaliseRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount > (approversCount/2));
        request.recipient.transfer(request.value);

        request.complete = true;
    }

    function getSummary() public view returns(
      uint, uint, uint, uint, address
      ) {
        return (
          minimumContribution,
          this.balance,
          requests.length,
          approversCount,
          manager
          );
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }
}
