import react , {Component} from 'react';
import Layout from '../../components/layout.js';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import factory from '../../ethereum/factory.js'
import web3 from '../../ethereum/web3.js'
import { Link, Router } from '../../routes';


class CampaignNew extends Component{
  state={
    minimumContribution: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async (event)=> {
    event.preventDefault();
    this.setState({loading:true});

    try{
    const accounts = await window.ethereum.enable()
    await factory.methods.createCampaign(this.state.minimumContribution).send({
        from:accounts[0]
      });
      Router.pushRoute('/');
    }catch(error){
      console.log(error.message);
      this.setState({errorMessage: error.message});
    }

    this.setState({loading: false, errorMessage: ''});
  };

  render(){
    return(
      <Layout>
      <link
    rel="stylesheet"
    href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"/>
       <h3> Create A campaign </h3>
       <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
        <label> Minimum Contribution </label>
        <Input
        label="wei"
        labelPosition="right"
        style={{marginBottom: "2px"}}
        value={this.state.minimumContribution}
        onChange={event =>
          this.setState({minimumContribution: event.target.value})}
          />
          <Message error header="Failed !" content ={this.state.errorMessage} />
          <Button type="Submit" primary loading={this.state.loading}>Create</Button>
        </Form.Field>
       </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
