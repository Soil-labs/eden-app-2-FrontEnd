import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

const appUrl =
  process.env.NEXT_PUBLIC_ENV_BRANCH === "develop"
    ? `https://eden-saas-staging.vercel.app/`
    : `https://developer-dao.joineden.ai/`;

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
          <meta property="og:url" content={appUrl} />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />

          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400;1,900&display=swap"
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
