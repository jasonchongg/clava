import React, { useState, useEffect, createContext } from 'react';
import { BigNumber, ethers, providers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { particleId, IProton } from 'types';
import { getData } from 'services/subgraph';
const daiAddresses = require('lib/daiAddress.json');
const daiAbi = require('lib/abis/dai.json');
const nftInfo = require('lib/nftInfos.json');
const clavaAbi = require('lib/abis/clava.json');

// todo: update values later
const CREATOR = '0x72E7cb696cd282E4709AFa2a669dbc74151188Ce';
const REFERRER = '0x0000000000000000000000000000000000000000';

interface Web3ConnectProviderContext {
  daiBalance: number;
  ethBalance: number;
  loadDaiBalance: () => void;
  loadEthBalance: () => void;
  loaded: boolean;
  mintChargedParticle: (id: particleId) => void;
  getCurrentCharge: (tokenId: number) => any;
  releaseParticle: (tokenId: number) => void;
  dischargeParticle: (tokenId: number) => void;
  mintClava: (amount: any) => void;
  approveDai: () => void;
  didApproveEnoughDai: (amount: number) => void;
  daiApproved: boolean;
  myAssets: IProton[];
}

export const Context = createContext<Web3ConnectProviderContext>({
  daiBalance: 0,
  ethBalance: 0,
  loadDaiBalance: () => {},
  loadEthBalance: () => {},
  loaded: false,
  mintChargedParticle: () => {},
  getCurrentCharge: () => {},
  releaseParticle: () => {},
  dischargeParticle: () => {},
  mintClava: () => {},
  approveDai: () => {},
  didApproveEnoughDai: () => {},
  daiApproved: false,
  myAssets: [],
});

const Web3ConnectProvider: React.FC = ({ children }) => {
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  } = useWeb3React<providers.Web3Provider>();
  const [daiBalance, setDaiBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [daiApproved, setDaiApproved] = useState(false);
  const [myAssets, setMyAssets] = useState([]);

  useEffect(() => {
    loadDaiBalance();
    loadEthBalance();
    loadApproveDai();
  }, [account, chainId]);

  useEffect(() => {
    if (account) {
      loadAssets(account);
    }
  }, [account]);

  const loadAssets = async (account: string) => {
    const assets: any = await getData(account);
    setMyAssets(assets);
  };

  const loadDaiBalance = async () => {
    if (chainId && account) {
      setLoaded(false);
      const daiContract = new ethers.Contract(daiAddresses[chainId], daiAbi, library);
      const daiBalance = await daiContract.balanceOf(account);
      setDaiBalance(Math.round(Number(ethers.utils.formatUnits(daiBalance, 18))));
      setLoaded(true);
    }
  };

  const loadEthBalance = async () => {
    if (chainId && account) {
      setLoaded(false);
      library?.getBalance(account).then((balance: any) => {
        let balanceInEth = ethers.utils.formatEther(balance);
        setEthBalance(Number(Number(balanceInEth).toFixed(2)));
        setLoaded(true);
      });
    }
  };

  const loadApproveDai = async () => {
    if (chainId && account) {
      const didApprove = (await didApproveEnoughDai(10000)) || false;
      setDaiApproved(didApprove);
    }
  };

  const approveDai = async () => {
    if (chainId !== 42) return;
    if (!library) return window.alert('Please connect to Web3');
    const kovanAddresses = require('@charged-particles/protocol-subgraph/networks/kovan');
    const signer = library.getSigner(account as string);
    const daiContract = new ethers.Contract(daiAddresses[chainId], daiAbi, signer);
    try {
      await daiContract.approve(kovanAddresses.proton.address, ethers.utils.parseEther(String(10000000)));
    } catch (e) {
      console.error('error in approving dai:', e);
    }
  };

  const didApproveEnoughDai = async (value: number) => {
    if (chainId !== 42) return;
    if (!library) return window.alert('Please connect to Web3');
    const kovanAddresses = require('@charged-particles/protocol-subgraph/networks/kovan');
    const signer = library.getSigner(account as string);
    const daiContract = new ethers.Contract(daiAddresses[chainId], daiAbi, signer);
    try {
      const approved = await daiContract.allowance(account, kovanAddresses.proton.address);
      return Math.round(Number(ethers.utils.formatUnits(approved, 18))) > value;
    } catch (e) {
      console.error('error in reading dai approval:', e);
    }
  };

  const mintChargedParticle = async (id: particleId) => {
    if (chainId !== 42) return;
    if (!library) return window.alert('Please connect to Web3');
    const kovanAddresses = require('@charged-particles/protocol-subgraph/networks/kovan');
    const protonAbi = require('@charged-particles/protocol-subgraph/abis/Proton');
    const protonAddress = kovanAddresses.proton.address;
    const signer = library.getSigner(account as string);
    const protonContract = new ethers.Contract(protonAddress, protonAbi, signer);
    // interface: https://docs.charged.fi/charged-particles-protocol/smart-contracts-documentation/contracts/proton-contract#createchargedparticle
    // todo: add a relayer contract (so that uri, price, percent is decided by creator)
    try {
      const mintingTx = await protonContract.createChargedParticle(
        CREATOR,
        account,
        REFERRER,
        nftInfo[id].uri,
        'aave',
        daiAddresses[chainId],
        ethers.utils.parseEther(String(nftInfo[id].price).toString()).toString(),
        '10000'
      );
      console.log(mintingTx);
    } catch (e) {
      console.error('error in minting particle: ', e);
    }
  };

  // Signature: currentParticleCharge(address,uint256,string,address)(uint256)
  const getCurrentCharge = async (tokenId: number) => {
    if (chainId !== 42) return;
    if (!library) return window.alert('Please connect to Web3');
    const kovanAddresses = require('@charged-particles/protocol-subgraph/networks/kovan');
    const chargedParticlesAbi = require('@charged-particles/protocol-subgraph/abis/ChargedParticles');
    const chargedParticlesAddress = kovanAddresses.chargedParticles.address;
    const protonAddress = kovanAddresses.proton.address;

    const chargedParticlesContract = new ethers.Contract(
      chargedParticlesAddress,
      chargedParticlesAbi,
      ethers.getDefaultProvider()
    );
    console.log(chargedParticlesContract);

    // Signature: currentParticleCharge(address,uint256,string,address)(uint256)

    // Params: https://docs.charged.fi/charged-particles-protocol/smart-contracts-documentation/contracts/smart-contracts-documentation#currentparticlecharge

    const chargeTx = await chargedParticlesContract.currentParticleCharge(
      protonAddress,
      tokenId,
      'aave',
      daiAddresses[chainId]
    );
    console.log(chargeTx);

    return { chargeTx };
  };

  const releaseParticle = async (tokenId: number) => {
    if (chainId !== 42) return;
    if (!library) return window.alert('Please connect to Web3');
    const kovanAddresses = require('@charged-particles/protocol-subgraph/networks/kovan');
    const chargedParticlesAbi = require('@charged-particles/protocol-subgraph/abis/ChargedParticles');
    const chargedParticlesAddress = kovanAddresses.chargedParticles.address;
    const signer = library.getSigner(account as string);
    const chargedParticlesContract = new ethers.Contract(chargedParticlesAddress, chargedParticlesAbi, signer);
    // interface: https://docs.charged.fi/charged-particles-protocol/smart-contracts-documentation/contracts/proton-contract#createchargedparticle
    // todo: add a relayer contract (so that uri, price, percent is decided by creator)
    try {
      const releaseTx = await chargedParticlesContract.releaseParticle(
        account,
        kovanAddresses.proton.address, // address contractAddress,
        tokenId, // uint256 tokenId,
        'aave',
        daiAddresses[chainId]
      );
      console.log(releaseTx);
    } catch (e) {
      console.error('error in discharging particle: ', e);
    }
  };

  const dischargeParticle = async (tokenId: number) => {
    if (chainId !== 42) return window.alert('Please switch to Kovan Network');
    if (!library) return window.alert('Please connect to Web3');
    const kovanAddresses = require('@charged-particles/protocol-subgraph/networks/kovan');
    const chargedParticlesAbi = require('@charged-particles/protocol-subgraph/abis/ChargedParticles');
    const chargedParticlesAddress = kovanAddresses.chargedParticles.address;
    const signer = library.getSigner(account as string);
    const chargedParticlesContract = new ethers.Contract(chargedParticlesAddress, chargedParticlesAbi, signer);
    // interface: https://docs.charged.fi/charged-particles-protocol/smart-contracts-documentation/contracts/proton-contract#createchargedparticle
    // todo: add a relayer contract (so that uri, price, percent is decided by creator)
    try {
      const dischargeTx = await chargedParticlesContract.energizeParticle(
        kovanAddresses.proton.address, // address contractAddress,
        tokenId, // uint256 tokenId,
        'generic',
        '0xb8e2eba3601375c19c1b6e6ef977f9eb18ddf92c',
        BigNumber.from('10000000000000000'),
        REFERRER
      );
      console.log(dischargeTx);
    } catch (e) {
      console.error('error in discharging particle: ', e);
    }
  };

  const mintClava = async (amount: any) => {
    if (chainId !== 42) return window.alert('Please switch to Kovan Network');
    if (!library) return window.alert('Please connect to Web3');
    const clavaAddress = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4';
    const signer = library.getSigner(account as string);
    const clavaContract = new ethers.Contract(clavaAddress, clavaAbi, signer);

    console.log(amount);
    try {
      const mintTx = await clavaContract.mint(account, amount);
      console.log(mintTx);
    } catch (e) {
      console.error('error in minting clava: ', e);
    }
  };

  return (
    <Context.Provider
      value={{
        daiBalance,
        ethBalance,
        loadDaiBalance,
        loadEthBalance,
        loaded,
        mintChargedParticle,
        getCurrentCharge,
        releaseParticle,
        dischargeParticle,
        mintClava,
        approveDai,
        didApproveEnoughDai,
        daiApproved,
        myAssets,
      }}>
      {children}
    </Context.Provider>
  );
};

export default Web3ConnectProvider;
