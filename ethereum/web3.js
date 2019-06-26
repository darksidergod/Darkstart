import Web3 from 'web3'
let web3;

if (typeof window !== 'undefined') {
  // We are in the browser and metamask is running
  if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
    console.log("eth")


  } else if (typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
    console.log("custom provider")
  }
} else {
  // Wa are on the server OR the user is not using metamask
  const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/f5bcecfe34ce4266900d381b31f68ccb')
  web3 = new Web3(provider)
  console.log('rinkeby')
}
export default web3;
