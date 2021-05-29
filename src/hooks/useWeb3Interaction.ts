import { useContext } from 'react';

import { Context } from 'providers/Web3InteractionProvider';

const useWeb3Interaction = () => {
  const {
    daiBalance,
    ethBalance,
    loadDaiBalance,
    loadEthBalance,
    loaded,
    mintChargedParticle,
    getCurrentCharge,
    approveDai,
    didApproveEnoughDai,
    daiApproved,
    myAssets,
  } = useContext(Context);
  return {
    daiBalance,
    ethBalance,
    loadDaiBalance,
    loadEthBalance,
    loaded,
    mintChargedParticle,
    getCurrentCharge,
    approveDai,
    didApproveEnoughDai,
    daiApproved,
    myAssets,
  };
};

export default useWeb3Interaction;
