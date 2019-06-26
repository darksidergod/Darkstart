import web3 from './web3.js';
import CampaignFactory from './build/campaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xa1734d5a6cC0275eA17D45c7B267749382057246'
);

export default instance;
