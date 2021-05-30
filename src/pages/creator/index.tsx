import style from './index.module.scss';
import AppLink from 'components/AppLink';
import { useState } from 'react';
const IPFS = require('ipfs-core');

export default function home() {
  const [file, setFile] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [salePrice, setSalePrice] = useState('0');
  const [tokensPerDollar, setTokensPerDollar] = useState('10');
  const [membershipType, setMembershipType] = useState('Standard');
  const [ipfsURL, setIPFSURL] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const ipfs = await IPFS.create();
    const { cid } = await ipfs.add(
      JSON.stringify({
        name,
        description,
        salePrice,
        tokensPerDollar,
        membershipType,
        url: file,
      })
    );
    setIPFSURL(`https://ipfs.io/ipfs/${cid}`);
  };
  const handleChange = (e: any) => {
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div>
      <div className={style.hero}>
        <div>
          <div className={style.headline}>Create A NFT</div>
          <div className={style.explanation}>
            <form onSubmit={handleSubmit} className={style.nftform}>
              <input type='text' onChange={e => setName(e.target.value)} placeholder='Name' />
              <input type='text' onChange={e => setDescription(e.target.value)} placeholder='Description' />
              <input type='text' onChange={e => setSalePrice(e.target.value)} placeholder='Sale Price' />
              <input
                type='text'
                onChange={e => setTokensPerDollar(e.target.value)}
                placeholder='Coins per $1 Interest'
              />
              <input type='text' onChange={e => setMembershipType(e.target.value)} placeholder='Membership Type' />
              <input type='file' onChange={e => handleChange(e)} />
              <img src={file} style={{ height: '500px', outline: '2px dashed white' }} />
              <input type='submit' value='Create NFT' />
            </form>
            {ipfsURL && <p> Metadata stored at : {ipfsURL} </p>}
          </div>
        </div>
      </div>
      <div className={style.title}>Previous Memberships</div>
      <AppLink href='/memberships' className={style.buy}>
        Zero Interest Memberships!
      </AppLink>
      <div className={style.updates}>
        <div className={style.updates__update}>
          <img src='images/update0.png' />
          <div>MrRoflWaffles posted a new video, go check it out!</div>
        </div>
        <div className={style.updates__update}>
          <img src='images/update1.png' />
          <div>A new experience was released! Claim your signed Tee now.</div>
        </div>
        <div className={style.updates__update}>
          <img src='images/update2.png' />
          <div>Check out this gameplay tutorial and tell us what you think!</div>
        </div>
      </div>
    </div>
  );
}
