import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const AvailableLanguages = [
  'en',
];

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      'menu.link-home': 'Home',
      'home.title': 'Spotify Funky Project',
      'home.description':
        'Discover underplayed songs in your playlists and saved songs.',
      'home.login-button': 'Log in with Spotify',
      'meta.title':
        'Spotify Funky Project - Discover underplayed songs from your Spotify library',
      'meta.description':
        'Discover underplayed songs and artists from your Spotify playlists and saved tracks. Quick and easy.',
      'footer.author1': 'Made with ♥ by {{- linkOpen}}Becca{{- linkClose}}',
      'footer.author2': 'and {{- linkOpen}}Katelyn 👨‍💻{{- linkClose}}',
      'footer.github':
        'Check out the original {{- linkOpen}}Spotify Dedup code{{- linkClose}} on GitHub 📃',
      'result.duplicate.reason-same-id': 'Duplicate',
      'result.duplicate.reason-same-data':
        'Duplicate (same name, artist and duration)',
      'result.duplicate.track':
        '<0>{{trackName}}</0> <2>by</2> <4>{{trackArtistName}}</4>',
      'process.status.finding':
        'Finding underplayed songs in your playlists and saved songs…',
      'process.status.complete': 'Processing complete!',
      'process.status.complete.body':
        'Your playlists and saved songs have been processed!',
      'process.status.complete.dups.body':
        'Click on the {{- strongOpen}}Remove duplicates{{- strongClose}} button to get rid of duplicates in that playlist or saved songs collection.',
      'process.reading-library':
        'Going through your library, finding the playlists you own and your saved songs…',
      'process.processing_one':
        'Searching for underplayed songs, wait a sec. Still to process {{count}} playlist…',
      'process.processing_other':
        'Searching for underplayed songs, wait a sec. Still to process {{count}} playlists…',
      'process.saved.title': 'Saved songs in your library',
      'process.saved.duplicates_one':
        'This collection has {{count}} underplayed songs',
      'process.saved.duplicates_other':
        'This collection has {{count}} underplayed songs',
      'process.saved.remove-button': 'Remove underplayed songs from your saved songs',
      'process.playlist.createPlaylist-button': 'Create playlist from {{count}} songs',
      'process.playlist.duplicates_one':
        'This playlist has {{count}} underplayed song',
      'process.playlist.duplicates_other':
        'This playlist has {{count}} underplayed songs',
      'process.playlist.remove-button': 'Remove underplayed songs from this playlist',
      'process.items.removed': 'Underplayed songs removed',
    },
  },
  fallbackLng: 'en',
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    keySeparator: false, // we do not use keys in form messages.welcome
    debug: false,
    react: {
      transSupportBasicHtmlNodes: false,
    },
    missingKeyHandler: (
      lng,
      ns,
      key,
      fallbackValue,
      updateMissing,
      options
    ) => {
      console.log('Missing key', key);
    },
  });
export default i18n;
