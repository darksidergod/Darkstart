import web3 from './web3.js';
import Campaign from './build/Campaign.json';

export default (address)=> {
  return new web3.eth.Contract(JSON.parse(Campaign.interface), address);
};
