import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

import paywallConfig from 'constants/paywallConfig';

export default class MyDocument extends Document<any> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const unlockTag = {
      __html: `
      (function(d, s) {
        var js = d.createElement(s),
        sc = d.getElementsByTagName(s)[0];
        js.src="https://paywall.unlock-protocol.com/static/unlock.latest.min.js";
        sc.parentNode.insertBefore(js, sc); }(document, "script"))`,
    };
    const unlockConfigTag = {
      __html: `
      var unlockProtocolConfig = ${JSON.stringify(paywallConfig)}`,
    };
    return {
      ...initialProps,
      unlockTag,
      unlockConfigTag,
    };
  }

  render() {
    return (
      <Html lang='en'>
        <Head>
          <script dangerouslySetInnerHTML={this.props.unlockTag} />
          <script dangerouslySetInnerHTML={this.props.unlockConfigTag} />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
