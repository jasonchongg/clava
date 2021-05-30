const paywallConfig = {
  network: 1,
  locks: {
    // '0xFBE0B6897750e3C7419b74336667E0eCD4bB8e1C': {
    '0x7E5FEd6df6C49c6C865C7fDe640bE18a5580b24B': {
      name: 'Unlock Conference',
      network: 4,
    },
  },
  icon:
    'https://raw.githubusercontent.com/unlock-protocol/unlock/master/design/brand/1808-Unlock-Identity_Unlock-WordMark.svg',
  callToAction: {
    default: 'To access the esclusive conference, please pay 10 CryptoCobain coins!',
  },
};

module.exports = paywallConfig;
