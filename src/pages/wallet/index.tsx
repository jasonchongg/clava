import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';
import styles from './wallet.module.scss';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import useWeb3Interaction from 'hooks/useWeb3Interaction';
import NFT from 'components/NFT';
import AppLink from 'components/AppLink';
import { BigNumber } from 'ethers';

const Wallet = () => {
  const { account } = useWeb3React();
  const {
    daiBalance,
    ethBalance,
    loaded,
    myAssets,
    releaseParticle,
    dischargeParticle,
    mintClava,
  } = useWeb3Interaction();
  const [showBalance, setShowBalance] = useState(false);

  const buyDai = () => {
    new RampInstantSDK({
      hostAppName: 'LootVault',
      hostLogoUrl: 'https://lootvault.vercel.app/images/logo.png',
      swapAsset: 'DAI',
      userAddress: `${account}`,
    }).show();
  };

  const buyEth = () => {
    new RampInstantSDK({
      hostAppName: 'LootVault',
      hostLogoUrl: 'https://lootvault.vercel.app/images/logo.png',
      swapAsset: 'ETH',
      userAddress: `${account}`,
    }).show();
  };

  const toggleBalance = () => {
    showBalance ? setShowBalance(false) : setShowBalance(true);
  };

  return (
    <div>
      <div className={styles.headline}>Your Wallet</div>
      <div className={styles.container}>
        <div className={styles.balances__header}>
          <span>Balances</span>
          <button onClick={toggleBalance}>{showBalance ? 'Hide' : 'Show'}</button>
        </div>
        <div className={styles.balances__tokens}>
          {showBalance ? (
            <>
              <div className={styles.balances__tokens__token}>
                <span>DAI</span>
                <div className={styles.balances__tokens__token__balance}>
                  <span>$ {loaded ? daiBalance : '...loading'}</span>
                  <button onClick={buyDai}>Buy DAI</button>
                </div>
              </div>
              <div className={styles.balances__tokens__token}>
                <span>ETH</span>
                <div className={styles.balances__tokens__token__balance}>
                  <span>Ξ {loaded ? ethBalance : '...loading'}</span>
                  <button onClick={buyEth}>Buy ETH</button>
                </div>
              </div>
            </>
          ) : null}
        </div>
        <div className={styles.nfts}>Your Memberships</div>
        <div className={styles.nfts__list}>
          <button onClick={() => mintClava(BigNumber.from('1000000000000000000000'))}>Mint Clava</button>
          {myAssets.length ? (
            myAssets.map((asset, index) => {
              return (
                <>
                  <NFT key={index} asset={asset} />
                  <button onClick={() => dischargeParticle(192)}> Discharge Particle </button>
                  <button onClick={() => releaseParticle(192)}> Release Particle </button>
                </>
              );
            })
          ) : (
            <div className={styles.nfts__list__buy}>
              <span>Looks like you're not a member yet.</span>
              <AppLink href={'/memberships'}>Buy Membership</AppLink>
            </div>
          )}
          {/* {MEMBERSHIPS.map((tier, index) => (
            <div className={cn([styles.nfts__list__item, styles[`nfts__list__item--${index}`]])} key={index}>
              <img src={tier.image} />
              <span className={styles.nfts__list__item__xp}>Current: {tier.currentXp} XP</span>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
