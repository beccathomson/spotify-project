import promisesForPages from './promiseForPages';
import SpotifyWebApi, { SpotifyArtistType, SpotifyTrackType } from './spotifyApi';

export const fetchUserOwnedPlaylists = async (
  api: SpotifyWebApi,
  userId: string
) => {
  const pages = await promisesForPages(
    api,
    api.getUserPlaylists(userId, { limit: 50 })
  );

  return pages.reduce(
    (array, currentPage) =>
      array.concat(
        currentPage.items.filter(
          (playlist) => playlist && playlist.owner.id === userId
        )
      ),
    []
  );
};


export const fetchUserTopArtists = async (
  api: SpotifyWebApi,
) => {
  const pages = await promisesForPages(
    api,
    api.getUserTopItems("artists", { time_range: 'long_term', limit: 200 })
  );

  return pages.reduce(
    (array, currentPage) => array.concat(currentPage.items), []
  );
};

export const fetchUserTopTracks = async (
  api: SpotifyWebApi,
) => {
  const pages = await promisesForPages(
    api,
    api.getUserTopItems("tracks", { time_range: 'long_term', limit: 300 })
  );

  return pages.reduce(
    (array, currentPage) => array.concat(currentPage.items), []
  );
};


