import { SpotifyTrackType, SpotifyPlaylistType } from './spotifyApi';
import { ReactElement } from 'react';

export type PlaylistModel = {
  playlist: SpotifyPlaylistType;
  unpopularSongs: Array<{
    index: number;
    track: SpotifyTrackType;
  }>;
  status: string;
  processed: boolean;
};
