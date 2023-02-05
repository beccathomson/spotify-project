import { SAVED_SONGS_ID } from '@/components/main';
import promisesForPages from './promiseForPages';
import SpotifyWebApi, {
  SpotifyTrackType,
  SpotifyPlaylistType,
  SpotifyPlaylistTrackType,
  SpotifySavedTrackType,
  SpotifyArtistType,
} from './spotifyApi';

class BaseDeduplicator {
  async removeDuplicates(model) {
    throw 'Not implemented';
  }

  async getTracks() {
    throw 'Not implemented';
  }

  // compare the main artist of each track with list of all user top artists, return track if artist has
  // never been in user's top artists
  // could additionally check top songs over history
  //todo: don't return duplicate songs

  // TODO: make map of artist ids
  static findUnpopularSongs(topArtists: Array<SpotifyArtistType>, topTracks: Array<SpotifyTrackType>, tracks: Array<SpotifyTrackType>) {
    const topArtistIds: string[] = topArtists.map((artist) => artist.id);
    const topTrackIds: string[] = topTracks.map((track) => track.id);

    const result = tracks.reduce((unpopularSongs, track, index) => {
      if (track?.artists === null) return unpopularSongs;
      let isPopular = true;
      const mainArtistId = track.artists[0].id;
      if (topArtistIds.includes(mainArtistId) || topTrackIds.includes(track.id) || unpopularSongs.map(song => song.track.id).includes(track.id)) {
        return unpopularSongs
      } else {
        isPopular = false;
        unpopularSongs.push({
          index: index,
          track: track,
        });
      }

      return unpopularSongs;
    }, []);
    return result;
  }
}

export class PlaylistDeduplicator extends BaseDeduplicator {
  static async getTracks(
    api: SpotifyWebApi,
    playlist: SpotifyPlaylistType
  ): Promise<Array<SpotifyTrackType>> {
    return new Promise((resolve, reject) => {
      const tracks = [];
      promisesForPages(
        api,
        api.getGeneric(playlist.tracks.href) // 'https://api.spotify.com/v1/users/11153223185/playlists/0yygtDHfwC7uITHxfrcQsF/tracks'
      )
        .then(
          (
            pagePromises // todo: I'd love to replace this with //@us could we do this for him ?
          ) =>
            // .then(Promise.all)
            // à la http://www.html5rocks.com/en/tutorials/es6/promises/#toc-transforming-values
            Promise.all(pagePromises)
        )
        .then((pages) => {
          pages.forEach((page) => {
            page.items.forEach((item: SpotifyPlaylistTrackType) => {
              tracks.push(item && item.track);
            });
          });
          resolve(tracks);
        })
        .catch(reject);
    });
  }

}

export class SavedTracksDeduplicator extends BaseDeduplicator {
  static async getTracks(
    api: SpotifyWebApi,
    initialRequest
  ): Promise<Array<SpotifyTrackType>> {
    return new Promise((resolve, reject) => {
      const tracks = [];
      promisesForPages(api, initialRequest)
        .then(
          (
            pagePromises // todo: I'd love to replace this with
          ) =>
            // .then(Promise.all)
            // à la http://www.html5rocks.com/en/tutorials/es6/promises/#toc-transforming-values
            Promise.all(pagePromises)
        )
        .then((pages) => {
          pages.forEach((page) => {
            page.items.forEach((item: SpotifySavedTrackType) => {
              tracks.push(item.track);
            });
          });
          resolve(tracks);
        })
        .catch((e) => {
          console.error(
            `There was an error fetching the tracks from playlist ${initialRequest.href}`,
            e
          );
          reject(e);
        });
    });
  }


  static async removeSelectedSongsFromPlaylist(
    api: SpotifyWebApi,
    selectedSongUris: Array<string>,
    playlistId: string
  ) {
    return new Promise<void>((resolve, reject) => {

      const promises = [];
      do {
        const chunk = selectedSongUris.splice(0, 100);
        (function (playlistModel, chunk, api) {
          promises.push(() =>
            api.removeTracksFromPlaylist(
              playlistId,
              chunk
            )
          );
        })(playlistId, chunk, api);
      } while (selectedSongUris.length > 0);

      promises
        .reduce(
          (promise, func) => promise.then(() => func()),
          Promise.resolve(null)
        )
        .then(() => {
          selectedSongUris = [];
          resolve();
        })
        .catch((e) => {
          reject(e);
        });

    });
  }



  static async removeSelectedPlaylistSongs(
    api: SpotifyWebApi,
    selectedSongUris: Array<string>,
    playlistIds: Array<string>
  ) {

    return Promise.all(playlistIds.map((playlistId) => this.removeSelectedSongsFromPlaylist(api, selectedSongUris, playlistId)));

  }


  static async removeSelectedSavedSongs(
    api: SpotifyWebApi,
    selectedSongUris: Array<string>

  ) {
    return new Promise<void>((resolve, reject) => {
      do {
        (async () => {
          const chunk = selectedSongUris.splice(0, 50);
          await api.removeFromMySavedTracks(chunk);
        })();
      } while (selectedSongUris.length > 0);
      selectedSongUris = [];
      resolve();
    });
  }

  static async removeSelectedSongs(
    api: SpotifyWebApi,
    selectedSongMap: Map<string, Array<SpotifyTrackType>>,
    currentPlaylistId: string,
  ) {

    let allTracks = selectedSongMap.get(currentPlaylistId);
    console.log(allTracks);
    console.log(currentPlaylistId);
    const trackUris = allTracks.map(track => track.uri);
    const trackIds = allTracks.map((track) => track.id);

    if (currentPlaylistId === SAVED_SONGS_ID) {
      return this.removeSelectedSavedSongs(api, trackIds);
    } else {
      return this.removeSelectedSongsFromPlaylist(api, trackUris, currentPlaylistId);
    }
  }
}
