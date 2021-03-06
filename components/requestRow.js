import react, {Component} from 'react';
import {Table, Button} from 'semantic-ui-react';
import web3 from '../ethereum/web3.js';
import Campaign from '../ethereum/campaign.js';

class RequestRow extends Component {

  onApprove = async () => {
    const campaign = Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(this.props.id).
      send({from: accounts[0]});

    Route.pushRoute()
  };

  onFinalize = async ()=> {
    const campaign = Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.finaliseRequest(this.props.id).
      send({from: accounts[0]});
  };

  render(){
    const {Row, Cell} = Table;
    const {id, request, approversCount} = this.props;
    const readyToFinalize = request.approvalCount > approversCount/2;
    return (
      <Row disabled={request.complete} positive ={readyToFinalize && !request.complete}>
       <Cell> {this.props.id} </Cell>
       <Cell> {request.description} </Cell>
       <Cell> {web3.utils.fromWei(request.value, 'ether')} </Cell>
       <Cell> {request.recipient} </Cell>
       <Cell> {request.approvalCount}/{approversCount}</Cell>
       <Cell>
       {  request.complete ? null: (
         <Button
         basic color='green'
         onClick={this.onApprove}> Approve </Button>
        )
       }
       </Cell>

       <Cell>
      { request.complete ? null: (
        <Button basic color='blue' onClick = {this.onFinalize}> Finalize </Button>
        )
      }
      </Cell>

      </Row>
    );
  }

}

export default RequestRow;
