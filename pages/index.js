import react, {Component} from 'react';
import factory from '../ethereum/factory.js';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/layout.js';
import { Link } from '../routes.js';

class CampaignIndex extends Component {

  static async getInitialProps(){
    const campaigns = await factory.methods.getDeployedCampaign().call();
    return {campaigns};
  }

  renderCampaigns(){
    const items = this.props.campaigns.map(address => {
      return {
        header: address,
        description: (
          <Link route = {`/campaigns/${address}`}>
          <a>View Campaign</a>
          </Link>
        ),
        fluid: true
      };
    });
    return <Card.Group items = {items}/>;
  }

  render(){
    return(
      <Layout>
      <div>
    <link
  rel="stylesheet"
  href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"/>
  <h3> Open Campaigns </h3>
<Link route="campaigns/new">
 <a>
  <Button  floated ="right" content="Create" icon="add circle" primary />
 </a>
</Link>
{this.renderCampaigns()}

 </div>
 </Layout>

  );
 }

}

export default CampaignIndex;
