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
        'Delete repeated songs from your Spotify playlists and saved tracks automatically. Quickly and easy.',
      'features.find-remove.header': 'Find & remove',
      'features.find-remove.body':
        'Dedup checks your playlists and saved songs in {{- strongOpen}}your Spotify library{{- strongClose}}. Once Dedup finds duplicates you can remove them per-playlist basis.',
      'features.safer.header': 'Safer',
      'features.safer.body':
        'Dedup will only remove {{- strongOpen}}duplicate songs{{- strongClose}}, leaving the rest of the playlist and saved songs untouched.',
      'features.open-source.header': 'Open Source',
      'features.open-source.body':
        "You might want to have a look at the {{- linkGithubOpen}}source code on GitHub{{- linkGithubClose}}. This web app uses the {{- linkWebApiOpen}}Spotify Web API{{- linkWebApiClose}} to manage user's playlists and saved tracks.",
      'reviews.title': 'This is what users are saying',
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
      'process.status.complete.nodups.body':
        "Congrats! You don't have duplicates in your playlists nor saved songs.",
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
        'This playlist has {{count}} duplicate song',
      'process.playlist.duplicates_other':
        'This playlist has {{count}} duplicate songs',
      'process.playlist.remove-button': 'Remove underplayed songs from this playlist',
      'process.items.removed': 'Underplayed songs removed',
      'spotifytop.heading': '🚀 Introducing Spotify Top!',
      'spotifytop.description':
        'Ever wondered what artists, songs, or genres you have been listening the most lately?',
      'spotifytop.check1': 'Check my latest project',
      'spotifytop.check2':
        'to get personalized insights about what you have been playing on Spotify',
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
