import React, { useContext } from 'react';
import Livestreaming from 'components/Livestreaming.jsx';

import { GlobalWrapper, MembershipContext } from 'components/shared/GlobalWrapper';

const ExperiencesContent = () => {
  const { becomeMember, isMember } = useContext(MembershipContext);

  if (isMember === 'yes') {
    return <Livestreaming></Livestreaming>;
  } else if (isMember === 'no') {
    becomeMember();
    return <p />;
  } else {
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
