import cn from 'classnames';
import styles from './memberships.module.scss';
import nftInfos from 'lib/nftInfos.json';
import { INFTInfos, particleId } from 'types';
import useWeb3Interaction from 'hooks/useWeb3Interaction';
import { useState } from 'react';
import Modal from 'components/Modal';
import experiences from 'lib/experiences.json';
import AppLink from 'components/AppLink';
import Link from 'next/link';

const Memberships = () => {
  const TIERS = Object.keys(nftInfos).map(number => (nftInfos as INFTInfos)[number]);
  const { mintChargedParticle, daiApproved, approveDai } = useWeb3Interaction();
  const [showApproveModal, setShowApproveModal] = useState(false);

  const MAX_SUPPLIES = [1000, 200, 50];

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
    <div>
      <div className={styles.headline}>Current Membership Tiers</div>
      <div className={styles.tiers}>
        {TIERS.map((tier, index) => (
          <div className={cn([styles.tiers__tier, styles[`tiers__tier--${index}`]])} key={index}>
            <img src={tier.image} />
            <div className={styles.tiers__tier__footer}>
              <p>{tier.name}</p>
              <span>$ {tier.price}</span>
            </div>
            <div className={styles.perks}>
              <span>{MAX_SUPPLIES[index].toLocaleString()}</span>
              <span>Memberships Sold</span>
            </div>
            <div className={styles.xp}>
              <div className={styles.xp__bars}>
                {Array.from(Array(Math.floor(tier.xp / 1000) + 1).keys()).map(barIndex => (
                  <div className={cn([styles.xp__bar, [styles[`xp__bar--${index}`]]])} key={barIndex}></div>
                ))}
              </div>
              <span>{tier.xp.toLocaleString()} $ / month</span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.headline}>Unlockable Experiences</div>
      <div className={styles.headline}>
        <div className={styles.experiences}>
          {experiences?.list.map((experience, index) => {
            if (index < 3) {
              return (
                <div>
                  <div className={styles.experiences__experience}>
                    <Link href='/experiences/0xFBE0B6897750e3C7419b74336667E0eCD4bB8e1C'>
                      <img src={experience.image} />
                    </Link>
                  </div>
                  <div className={styles.experiences__experience__title}>{experience.title}</div>
                  <div className={styles.experiences__experience__xp}>{experience.cost.toLocaleString()} CCB</div>
                </div>
              );
            } else {
              return null;
            }
          })}
          {renderSeeAll()}
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
