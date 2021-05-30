import cn from 'classnames';
import styles from './profile.module.scss';
import nftInfos from 'lib/nftInfos.json';
import { INFTInfos, particleId } from 'types';
import useWeb3Interaction from 'hooks/useWeb3Interaction';
import { useState } from 'react';
import Modal from 'components/Modal';
import { useWeb3React } from '@web3-react/core';
import experiences from 'lib/experiences.json';
import AppLink from 'components/AppLink';
import { BigNumber } from '@ethersproject/bignumber';

const Memberships = () => {
  const { account } = useWeb3React();
  const {
    daiBalance,
    ethBalance,
    loaded,
    myAssets,
    releaseParticle,
    dischargeParticle,
    getCurrentCharge,
    mintClava,
  } = useWeb3Interaction();
  const TIERS = Object.keys(nftInfos).map(number => (nftInfos as INFTInfos)[number]);
  const { mintChargedParticle, daiApproved, approveDai } = useWeb3Interaction();
  const [showApproveModal, setShowApproveModal] = useState(false);

  /* demo constants */
  const demoTokenId = 199;
  const demoClavaToMint = BigNumber.from('1000000000000000000000'); // 1000 clava

  const MAX_SUPPLIES = [1000, 200, 50];

  const handleRedemption = () => {
    mintClava(demoClavaToMint);
  };

  const handleBuy = async (id: particleId) => {
    if (!daiApproved) {
      return setShowApproveModal(true);
    }
    try {
      await mintChargedParticle(id);
    } catch (e) {
      console.error(e);
    }
  };

  const onApprove = async () => {
    await approveDai();
    setShowApproveModal(false);
  };

  const renderSeeAll = () => {
    return <button className={styles.placeholder}>Add New Experience</button>;
  };
  1;
  return (
    <div className={styles.profile}>
      <div className={styles.tiers}>
        <div className={cn([styles.tiers__tier, styles[`tiers__tier--0}`]])} key={0}>
          <img src={TIERS[0].image} />
          <div className={styles.tiers__tier__footer}>
            <p>Zero Risk NFT Membership</p>
            <span> Current Principal: $50 </span>
          </div>
          <div className={styles.perks}>
            <span>{MAX_SUPPLIES[0].toLocaleString()}</span>
            <span>Crypto Cobain Coins Earned</span>
          </div>
          <div className={styles.xp}>
            <div className={styles.xp__bars}>
              {Array.from(Array(Math.floor(TIERS[0].xp / 100) + 1).keys()).map(barIndex => (
                <div className={cn([styles.xp__bar, [styles[`xp__bar--${0}`]]])} key={barIndex}></div>
              ))}
            </div>
            <span> 200 Crypto Cobain Coins / month</span>
          </div>
        </div>
      </div>
      <div className={styles.metadata}>
        <div className={cn([styles.tiers__tier, styles[`tiers__tier--0`]])} key={0}>
          <button onClick={handleRedemption}> Redeem Crypto Cobain Coins </button>
          <button> Increase Principal </button>
          <button onClick={() => releaseParticle(demoTokenId)}> Refund NFT </button>
        </div>
      </div>
      <Modal isOpen={showApproveModal} onClose={() => setShowApproveModal(false)} header='Approve DAI'>
        <div className={styles.approve}>
          You need to approve DAI before you can purchase a Membership.
          <button onClick={onApprove}>Approve DAI</button>
        </div>
      </Modal>
    </div>
  );
};

export default Memberships;
