import promisesForPages from './promiseForPages';
import SpotifyWebApi, {
    SpotifyTrackType,
    SpotifyPlaylistType,
    SpotifyPlaylistTrackType,
    SpotifySavedTrackType,
    SpotifyArtistType,
} from './spotifyApi';
import { PlaylistModel } from './types';

export class PlaylistCreator {

    static async createPlaylistFromTracks(api: SpotifyWebApi, userId: string, trackUris: Array<string>) {

        // create the playlist
        return new Promise<void>((resolve, reject) => {
            api.createNewPlaylist(userId).then((res) => {
                const { id } = res as any;
                do {
                    (async () => {
                        const chunk = trackUris.splice(0, 100);
                        await api.addTracksToPlaylist(chunk, id);
                    })();
                } while (trackUris.length > 0);
            });
        });

    }

}