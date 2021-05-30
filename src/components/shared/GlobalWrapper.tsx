import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import getConfig from 'next/config';
import paywallConfig from 'constants/paywallConfig';

const config = getConfig().publicRuntimeConfig;

export const MembershipContext = React.createContext({
  isMember: 'pending',
  becomeMember: () => {},
});

export const GlobalWrapper: React.FC = ({ children }) => {
  const [isMember, setIsMember] = useState('pending');

  const becomeMember = () => {
    return window.unlockProtocol && window.unlockProtocol.loadCheckoutModal();
  };

  useEffect(() => {
    const existingScript = document.getElementById('unlock-protocol');

    if (!existingScript) {
      const script = document.createElement('script');

      script.innerText = `(function(d, s) {
        var js = d.createElement(s),
          sc = d.getElementsByTagName(s)[0];
        js.src="https://paywall.unlock-protocol.com/static/unlock.latest.min.js";
        sc.parentNode.insertBefore(js, sc); }(document, "script"));
      `;
      document.body.appendChild(script);

      window.addEventListener('unlockProtocol.status', (event: any) => {
        if (event?.detail?.state === 'locked') {
          setIsMember('no');
        } else if (event?.detail?.state === 'unlocked') {
          setIsMember('yes');
        }
      });
    }

    // Make sure the config is correct!
    window.unlockProtocolConfig = paywallConfig;

    // cleanup
    return () => {
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <MembershipContext.Provider
      value={{
        isMember,
        becomeMember,
      }}>
      {children}
    </MembershipContext.Provider>
  );
};

GlobalWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
