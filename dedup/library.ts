import promisesForPages from './promiseForPages';
import SpotifyWebApi, { SpotifyArtistType } from './spotifyApi';

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
  userId: string
): Promise<Array<SpotifyArtistType>> => {
  const pages = await promisesForPages(
    api,
    api.getUserTopArtists(userId, { time_range: 'long_term', limit: 200 })
  );
  console.log(pages);

  return pages.reduce(
    (array, currentPage) => array.concat(currentPage.items), []
  );
};


