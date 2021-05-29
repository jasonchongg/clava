import { useRouter } from 'next/router';
import { request, gql } from 'graphql-request';
import { useEffect, useState } from 'react';

const Profile = () => {
  const [token, setToken] = useState({});
  const router = useRouter();
  const { id } = router.query;
  const query = gql`
  {
    universes {
      protonToken {
        tokens(where: { tokenId: ${id} }) {
          id
          tokenId
          owner
          creator
          metadataUri
          particleType
          creatorAnnuity
          salePrice
          lastSalePrice
          resaleRoyalties
          resaleRoyaltiesRedirect
          name
          description
          external_url
          animation_url
          youtube_url
          icon
          image
          thumbnail
          symbol
          decimals
          background_color
          attributes {
            name
            value
          }
        }
      }
    }
  }
`;

  const doGraphRequest = (endpoint: any, query: any, variables = {}) =>
    new Promise((resolve, reject) => {
      request(endpoint, query, variables)
        .then(data => resolve(data))
        .catch(err => reject(err));
    });

  async function runGraphQuery() {
    const endpoint = 'https://api.thegraph.com/subgraphs/name/charged-particles/kovan-universe';
    const res: any = await doGraphRequest(endpoint, query);
    const { protonToken } = res.universes[0];
    setToken(protonToken.tokens[0]);
  }
  useEffect(() => {
    runGraphQuery();
  }, []);

  return (
    <>
      <p>{JSON.stringify(token)}</p>
      <p>Post: {id}</p>
    </>
  );
};

export default Profile;
