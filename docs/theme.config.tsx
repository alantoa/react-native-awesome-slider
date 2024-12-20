import { DocsThemeConfig, useConfig } from 'nextra-theme-docs';

const themeConfig: DocsThemeConfig = {
  logo: <span style={{ fontWeight: 'bold' }}>RNAS</span>,
  project: {
    link: 'https://github.com/alantoa/react-native-awesome-slider',
  },

  footer: {
    content: `MIT ${new Date().getFullYear()} © Alan Toa.`,
  },
  docsRepositoryBase: 'https://github.com/alantoa/react-native-awesome-slider',
  editLink: {
    content: 'Edit this page on GitHub →',
  },
  faviconGlyph: '✦',
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  head: function useHead() {
    const config = useConfig();
    const title = `${config.title} - Slider`;
    const description = config.frontMatter.description;
    const image = config.frontMatter.image;
    return (
      <>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta name="og:image" content={image} />

        <meta name="msapplication-TileColor" content="#fff" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta
          name="apple-mobile-web-app-title"
          content="React Native Awesome Slider"
        />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="https://slider.alantoa.com" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </>
    );
  },
};

export default themeConfig;
