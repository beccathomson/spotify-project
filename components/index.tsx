import Footer from './footer';
import Head from 'next/head';
import Header from './head';
import Intro from './intro';
import Main from './main';
import OAuthManager from '../dedup/oauthManager';
import React from 'react';
import SpotifyWebApi from '../dedup/spotifyApi';
import { useTranslation } from 'react-i18next';

const MetaHead = () => {
  const { t } = useTranslation();
  return (
    <Head>
      <title>{t('meta.title')}</title>
      <meta property="og:title" content={t('meta.title')} />
      <meta name="twitter:title" content={t('meta.title')} />
      <meta name="description" content={t('meta.description')} />
      <meta property="og:description" content={t('meta.description')} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="viewport" content="width=device-width" />
      <meta property="og:type" content="website" />
      <link rel="icon" href="logo.svg" />
    </Head>
  );
};
export default class Index extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    isLoggedIn: false,
    user: null,
    accessToken: null,
  };
  api = null;

  handleLoginClick = async () => {
    const accessToken = await OAuthManager.obtainToken({
      scopes: [
        /*
            the permission for reading public playlists is granted
            automatically when obtaining an access token through
            the user login form
            */
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-library-read',
        'user-top-read', // needed
        'user-library-modify',

      ],
    }).catch(function (error) {
      console.error('There was an error obtaining the token', error);
    });

    if (global['ga']) {
      global['ga']('send', 'event', 'spotify-dedup', 'user-logged-in');
    }

    this.api = new SpotifyWebApi();
    this.api.setAccessToken(accessToken);

    const user = await this.api.getMe();
    this.setState({ isLoggedIn: true, user, accessToken });
  };

  render() {
    return (
      <div className="container">
        <MetaHead />
        <Header />

        {this.state.isLoggedIn ? (
          <Main
            api={this.api}
            user={this.state.user}
            accessToken={this.state.accessToken}
          />
        ) : (
          <Intro onLoginClick={this.handleLoginClick} />
        )}
        <Footer />
      </div>
    );
  }
}
