const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/campaignFactory.json');

const mnemonic = 'gap dish subject used toward damp version cluster fence stone dinosaur penalty';
const infuraURL = 'https://rinkeby.infura.io/v3/f5bcecfe34ce4266900d381b31f68ccb'
const provider = new HDWalletProvider(mnemonic, infuraURL);
const web3 = new Web3(provider);

let getAccounts;
let result;

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Trying to deploy from: ', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)).deploy({data: '0x'+compiledFactory.bytecode}).send({gas: 1000000, from: accounts[0]});
  console.log("Deployed to: ,", result.options.address);
};

deploy();
