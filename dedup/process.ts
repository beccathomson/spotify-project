import { fetchUserOwnedPlaylists, fetchUserTopArtists } from './library';
import { PlaylistDeduplicator, SavedTracksDeduplicator } from './deduplicator';
import PlaylistCache from './playlistCache';
import { PlaylistModel } from './types';
import SpotifyWebApi, {
  SpotifyUserType,
  SpotifyPlaylistType,
  SpotifyTrackType,
  SpotifyArtistType,
} from './spotifyApi';

const playlistCache = new PlaylistCache();

const playlistToPlaylistModel = (
  playlist: SpotifyPlaylistType
): PlaylistModel => ({
  playlist: playlist,
  unpopularSongs: [],
  status: '',
  processed: false,
});

export default class {
  listeners: {};
  constructor() {
    this.listeners = {};
  }

  on(event: string, fn) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(fn);
  }

  dispatch(event: string, params) {
    const callbacks = this.listeners[event];
    callbacks.forEach((callback) => callback(params));
  }

  process = async (api: SpotifyWebApi, user: SpotifyUserType) => {
    const currentState: {
      playlists?: Array<PlaylistModel>;
      savedTracks?: {
        unpopularSongs?: Array<any>;
      };
      toProcess?: number;
    } = {};

    const dispatch = this.dispatch.bind(this);
    function onPlaylistProcessed(playlist: PlaylistModel) {
      playlist.processed = true;
      var remaining = currentState.toProcess - 1;
      currentState.toProcess -= 1;
      if (remaining === 0) {
        if (global['ga']) {
          global['ga']('send', 'event', 'spotify-dedup', 'library-processed');
        }
      }
      dispatch('updateState', currentState);
    }

    let playlistsToCheck = [];

    const allTopArtists: Array<SpotifyArtistType> = await fetchUserTopArtists(
      api,
    ).catch((e) => {
      if (global['ga']) {
        global['ga'](
          'send',
          'event',
          'spotify-dedup',
          'error-fetching-user-top-artists'
        );
      }
      console.error("There was an error fetching user's top artists", e);
    });


    const allTopTracks: Array<SpotifyTrackType> = await fetchUserTopArtists(
      api,
    ).catch((e) => {
      if (global['ga']) {
        global['ga'](
          'send',
          'event',
          'spotify-dedup',
          'error-fetching-user-top-artists'
        );
      }
      console.error("There was an error fetching user's top artists", e);
    });


    const ownedPlaylists: Array<SpotifyPlaylistType> = await fetchUserOwnedPlaylists(
      api,
      user.id
    ).catch((e) => {
      if (global['ga']) {
        global['ga'](
          'send',
          'event',
          'spotify-dedup',
          'error-fetching-user-playlists'
        );
      }
      console.error("There was an error fetching user's playlists", e);
    });

    if (allTopArtists) {
      playlistsToCheck = ownedPlaylists;
      currentState.playlists = playlistsToCheck.map((p) =>
        playlistToPlaylistModel(p)
      );
      currentState.toProcess =
        currentState.playlists.length + 1 /* saved tracks */;
      currentState.savedTracks = {};
      const savedTracks = await SavedTracksDeduplicator.getTracks(
        api,
        api.getMySavedTracks({ limit: 50 })
      );
      currentState.savedTracks.unpopularSongs = SavedTracksDeduplicator.findUnpopularSongs(
        allTopArtists,
        allTopTracks,
        savedTracks
      );
      if (currentState.savedTracks.unpopularSongs.length && global['ga']) {
        global['ga'](
          'send',
          'event',
          'spotify-dedup',
          'saved-tracks-found-duplicates'
        );
      }
      currentState.toProcess--;

      this.dispatch('updateState', currentState);

      for (const playlistModel of currentState.playlists) {
        if (playlistCache.needsCheckForDuplicates(playlistModel.playlist)) {
          try {
            const playlistTracks = await PlaylistDeduplicator.getTracks(
              api,
              playlistModel.playlist
            );
            playlistModel.unpopularSongs = PlaylistDeduplicator.findUnpopularSongs(
              allTopArtists,
              allTopTracks,
              playlistTracks
            );
            if (playlistModel.unpopularSongs.length === 0) {
              playlistCache.storePlaylistWithoutDuplicates(
                playlistModel.playlist
              );
            }
            onPlaylistProcessed(playlistModel);
          } catch (e) {
            console.error(
              'There was an error fetching tracks for playlist',
              playlistModel.playlist,
              e
            );
            onPlaylistProcessed(playlistModel);
          }
        } else {
          onPlaylistProcessed(playlistModel);
        }
      }
    }
  };
}
