import SpotifyWebApi, {
    SpotifyTrackType,
} from './spotifyApi';

export class PlaylistCreator {

    static async createPlaylistFromTracks(api: SpotifyWebApi, userId: string, trackMap: Map<string, Array<SpotifyTrackType>>) {
        let allTracks = [];
        trackMap.forEach((trackArray, __) => allTracks = allTracks.concat(trackArray));
        const trackUris = allTracks.map(track => track.uri);

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