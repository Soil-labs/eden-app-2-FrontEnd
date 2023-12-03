import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

const appUrl =
  process.env.NEXT_PUBLIC_ENV_BRANCH === "develop"
    ? `https://eden-foundation-develop.vercel.app/`
    : `https://edenprotocol.app/`;
const title = process.env.NEXT_PUBLIC_ENV_BRANCH
  ? `Eden protocol - ${process.env.NEXT_PUBLIC_ENV_BRANCH}`
  : `Eden protocol`;
const description = `Together, let's build the perfect breeding ground for everyone to do work they love. Eden's talent coordination protocol is how.`;

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="apple-touch-icon" sizes="192x192" href="/logo192.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/logo32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/logo16.png" />
          <meta property="twitter:card" content="summary" />
          <meta property="twitter:site" content={`Eden protocol`} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
          <meta
            property="twitter:image:src"
            content={`https://pbs.twimg.com/profile_images/1563942271170617344/4Tpfr8SY_400x400.jpg`}
          />
          <meta property="twitter:image:width" content="400" />
          <meta property="twitter:image:height" content="400" />
          <meta property="twitter:creator" content={`Eden protocol`} />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins&display=optional"
            rel="stylesheet"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />

          <link
            href="https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap"
            rel="stylesheet"
          />

          <link href="https://fonts.cdnfonts.com/css/moret" rel="stylesheet" />
          <link rel="stylesheet" href="https://use.typekit.net/vlw0gla.css" />

          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
