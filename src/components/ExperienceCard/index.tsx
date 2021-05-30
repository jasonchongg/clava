import Modal from 'components/Modal';
import useWeb3Interaction from 'hooks/useWeb3Interaction';
import { useState } from 'react';
import cn from 'classnames';
import { IProton } from 'types';
import styles from './ExperienceCard.module.scss';
import { useWeb3React } from '@web3-react/core';
import AppLink from 'components/AppLink';

interface IExperienceCard {
  experience: IExperience;
}

interface IExperience {
  title: string;
  image: string;
  description: string;
  cost: number;
  minted: number;
  maxMinted: number;
  id: string;
}

const index = ({ experience }: IExperienceCard) => {
  const { myAssets } = useWeb3Interaction();
  const maxCurrentXp = myAssets.length ? 1200 : 0;

  return (
    <div className={styles.experience}>
      {experience.maxMinted ? (
        <div className={styles.limited}>
          <span>
            {experience.minted}/{experience.maxMinted}
          </span>
          <small>Claimed</small>
        </div>
      ) : null}
      <div className={styles.experience__title}>{experience.title}</div>
      <img src={experience.image} />
      <div className={styles.experience__description}>{experience.description}</div>
      {maxCurrentXp < experience.cost ? (
        <div className={styles.xp}>
          <div className={styles.xp__inner} style={{ width: `${(maxCurrentXp / experience.cost) * 100}%` }} />
          <div className={styles.xp__text}>
            {maxCurrentXp.toLocaleString()} / {experience.cost.toLocaleString()} XP
          </div>
        </div>
      ) : (
        <button>
          <AppLink href={`/experiences/${experience.id}`}>Redeem</AppLink>
        </button>
      )}
    </div>
  );
};

export default index;
