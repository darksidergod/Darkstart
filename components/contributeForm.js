import react, { Component } from 'react';
import {Button, Form, Input, Message} from 'semantic-ui-react';
import Campaign from '../ethereum/campaign.js';
import web3 from '../ethereum/web3.js';
import { Router } from '../routes.js';


class ContributeForm extends Component {
  state = {
      value: '',
      errorMessage: '',
      loading: false
  };

  onSubmit = async (event) => {
    event.preventDefault();

    const campaign = Campaign(this.props.address);
    this.setState({loading: true, errorMessage:''});

   try{
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({from: accounts[0], value: web3.utils.toWei(this.state.value, 'ether')});
      console.log("transaction confirmed");
      Router.pushRoute(`/campaigns/${this.props.address}`);
      }
    catch(error){
      this.setState({errorMessage: error.message});
    }

    this.setState({loading: false, value: ''});
  };


  render() {
    return (
      <Form onSubmit={this.onSubmit} style={{marginTop: "10px"}} error={!!this.state.errorMessage}>
        <Form.Field>
          <label> Contribute </label>
           <Input value={this.state.value}
            onChange = {event => this.setState({value: event.target.value})}
            label="ether"
            labelPosition = "right"/>
        </Form.Field>
          <Button primary loading={this.state.loading}>
           Contribute !
          </Button>
          <Message error header = "Error" content={this.state.errorMessage}/>
      </Form>
    );

  }
}

export default ContributeForm;
