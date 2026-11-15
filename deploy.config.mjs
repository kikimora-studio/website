// Where this copy of the site is deployed. This is the only file that differs
// between deployments (e.g. Netlify at mehovconsult.com vs GitHub Pages).
export default {
  /**
   * Sub-path the site is served under, without a trailing slash:
   * '' for a domain root (mehovconsult.com), '/website' for
   * kikimora-studio.github.io/website. Internal links, images and styles are
   * prefixed with it at build time; canonical/SEO URLs keep pointing at
   * https://mehovconsult.com.
   */
  basePath: '/website',

  /**
   * Where the enquiry/contact forms are sent. Empty = Netlify Forms (only works
   * when hosted on Netlify). For any other host, a Formspree endpoint such as
   * 'https://formspree.io/f/abcdwxyz'.
   */
  formEndpoint: '',
};
