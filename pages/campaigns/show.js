import react, { Component } from 'react';
import Layout from '../../components/layout.js';
import Campaign from '../../ethereum/campaign.js';
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3.js';
import ContributeForm from '../../components/contributeForm.js';
import { Link } from '../../routes.js';

class CampaignShow extends Component{

  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const summary= await campaign.methods.getSummary().call();
    console.log(summary);
    return {
      campaignAddress: props.query.address,
      minimumContribution: summary[0],
      contractBalance: summary[1],
      requestCount: summary[2],
      approversCount: summary[3],
      manager: summary[4]
    };
  }

  renderCards() {
    const {
      contractBalance,
      manager,
      minimumContribution,
      requestCount,
      approversCount
    } = this.props;
    const amount = web3.utils.fromWei(contractBalance, 'ether');
    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description: 'Authorized to request withdrawal of money.',
        style: {overflowWrap: 'break-word'}
      },
      {
        header: minimumContribution,
        meta: 'Minimum amount to contribute(wei)',
        description: 'Become an approver.'
      },
      {
        header: requestCount,
        meta: 'Number of requests',
        description: 'This many requests have been made by manager.'
      },
      {
        header: approversCount,
        meta: 'No of approvers that exists',
        description: 'People donated.'
      },
      {
        header: amount,
        meta: 'ether',
        description: 'balance left in contract.'
      }
    ];

    return <Card.Group items = {items} />;
  }


  render(){
    return (
      <Layout>
      <h3> CampaignShow </h3>
      <Grid>
       <Grid.Row>
        <Grid.Column width={10}>
          {this.renderCards()}

        </Grid.Column>

        <Grid.Column width={6}>
          <ContributeForm address={this.props.campaignAddress}/>
        </Grid.Column>
       </ Grid.Row>

       <Grid.Column>
       <Grid.Row>
       <Link route={`/campaigns/${this.props.campaignAddress}/requests`}>
       <a>
         <Button primary style={{marginTop:"10px"}}>
         View Requests
         </Button>
       </a>
       </Link>

       </Grid.Row>
       </Grid.Column>
      </Grid>
      </Layout>
    );
  }
}
export default CampaignShow;
