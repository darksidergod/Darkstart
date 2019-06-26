import react, {Component} from 'react';
import Layout from '../../../components/layout.js';
import {Input, Form, Button, Message, Grid} from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign.js';
import web3 from '../../../ethereum/web3.js';
import {Link, Router} from '../../../routes.js';


class RequestNew extends Component {
  state = {
    description: '',
    value: '',
    recipient: '',
    loading: false,
    errorMessage: ''
  };

  static async getInitialProps(props) {
    const { address } = props.query;
    return { address };
  }

  onSubmit = async event => {
    event.preventDefault();
    this.setState({loading: true, errorMessage: ''});
    const campaign = Campaign(this.props.address);
    const { description, value, recipient } = this.state;
    try{
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.createRequest(description,
          web3.utils.toWei(value, 'ether'),
          recipient).
          send({from: accounts[0]
    });

    Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    }
    catch(error){
      this.setState({errorMessage: error.message});
    }
    this.setState({loading: false});

  };
  render(){
    return(
      <Layout>

      <h3> Create a request </h3>
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
         <label>Description</label>
         <Input
         value = {this.state.description}
         onChange = { event => this.setState({description: event.target.value}) }
         />
        </Form.Field>

        <Form.Field>
          <label> Value in ether </label>
          <Input
          value={this.state.value}
          onChange = {event=> this.setState({value:event.target.value})}
          />
        </Form.Field>

        <Form.Field>
         <label> Recipient </label>
         <Input
         value = {this.state.recipient}
         onChange = {event => this.setState({recipient: event.target.value})}
         />
        </Form.Field>
        <Grid.Column>
        <Button primary loading={this.state.loading}> Create </Button>
        </Grid.Column>
        <Grid.Column>

        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>
           <Button secondary  style={{marginTop: "10px"}}> Back </Button>
          </a>
        </Link>
        </Grid.Column>

        <Message error header="Error" content = {this.state.errorMessage}/>
      </Form>
    </Layout>

    );
  }

}

export default RequestNew;
