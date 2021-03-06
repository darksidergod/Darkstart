const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../ethereum/build/campaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async ()=> {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)).deploy({data: compiledFactory.bytecode}).send({from: accounts[0], gas: '1000000'});

  await factory.methods.createCampaign('100').send({from: accounts[0],gas: 1000000});

  [campaignAddress] = await factory.methods.getDeployedCampaign().call();
  campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface),campaignAddress);
});

describe('campaign-testing', () => {

  it('deployement complete', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('manager-marked', async ()=> {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it('contributor-marked', async ()=> {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1]
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it('minumum-contribution-noted', async ()=> {
    try{
      await campaign.methods.contribute().send({
         value: 5,
         from: accounts[0]
      });
      assert(false);

    } catch(error){
      assert(error);
    }
  });

  it('allows-manager-contribution', async ()=> {
    await campaign.methods
      .createRequest('Buy batteries', '100', accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      });

      const request = await campaign.methods.requests(0).call();
      assert.equal('Buy batteries', request.description);
  });

  it('processes request', async() => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });

    await campaign.methods.createRequest('A', web3.utils.toWei('10', 'ether'), accounts[1])
      .send({from:accounts[0], gas: '1000000'});

    await campaign.methods.approveRequest(0).send({from: accounts[0], gas: '1000000'});

    await campaign.methods.finaliseRequest(0).send({
      from:accounts[0],
      gas: '1000000'
    })
    let balance;
    balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);
    console.log(balance);

    assert(balance > 104);
  });
});
