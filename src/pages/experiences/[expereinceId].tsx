import React, { useContext } from 'react';
import useWeb3Interaction from 'hooks/useWeb3Interaction';

import { GlobalWrapper, MembershipContext } from 'components/shared/GlobalWrapper';

const ExperiencesContent = () => {
  const { myAssets } = useWeb3Interaction();
  const { becomeMember, isMember } = useContext(MembershipContext);

  if (isMember === 'yes') {
    return <div>Exclusive Conference Stream</div>;
  } else {
    becomeMember();
    return <p />;
  }
};

const Experiences = () => {
  return (
    <GlobalWrapper>
      <ExperiencesContent />
    </GlobalWrapper>
  );
};

export default Experiences;
