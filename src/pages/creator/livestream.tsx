import React, { useContext } from 'react';
import Livestreaming from 'components/Livestreaming.jsx';
import styles from './index.module.scss';
import cn from 'classnames';
import useWeb3Interaction from 'hooks/useWeb3Interaction';

import { GlobalWrapper, MembershipContext } from 'components/shared/GlobalWrapper';

const Experiences = () => {
  const { dischargeParticle } = useWeb3Interaction();

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ height: '1000px', width: '1000px' }}>
          <Livestreaming />
        </div>
        <div style={{ paddingLeft: '50px' }} className={cn([styles.tiers__tier, styles[`tiers__tier--0`]])} key={0}>
          <ul>
            <li>
              <span style={{ paddingRight: '100px' }}> Kaito joined the stream</span> <button> Energize </button>
            </li>
            <li>
              <span> Jason joined the stream</span>{' '}
              <button
                onClick={() => {
                  dischargeParticle(199);
                }}>
                Energize
              </button>
            </li>
            <li>
              <span> Alex joined the stream</span> <button> Energize </button>
            </li>
            <li>
              <span> Pryce joined the stream</span> <button> Energize </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Experiences;
