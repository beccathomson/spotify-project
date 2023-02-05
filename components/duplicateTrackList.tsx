import { SpotifyTrackType } from '@/dedup/spotifyApi';
import React, { useEffect, useState } from 'react';
import { Checkbox } from './checkbox';
import { DuplicateTrackListItem } from './duplicateTrackListItem';

export interface TrackListProps {
  playlistId: string;
  childTracks: Array<{ index: number, track: SpotifyTrackType }>;
  selectionCallback: (playlistId: string, selectedTracks: Array<SpotifyTrackType>) => void;
}

export const DuplicateTrackList = (props: TrackListProps): JSX.Element => {
  const { childTracks, playlistId, selectionCallback } = props;
  const [selectedTracks, setSelectedTracks] = useState(new Array<SpotifyTrackType>());
  useEffect(() => {
    console.log(selectedTracks);
    selectionCallback(playlistId, selectedTracks);
  }, [selectedTracks]);

  return (
    <div>
      {childTracks.map((song) => {
        return (
          <DuplicateTrackListItem
            selected={selectedTracks.includes(song.track)}
            trackName={song.track.name}
            trackArtistName={song.track.artists[0].name}
            uriValue={song.track.uri}
            onChange={() => {
              let newState = [...selectedTracks];
              if (selectedTracks.includes(song.track))
                newState = newState.filter((selectedTrack) => selectedTrack.id !== song.track.id)
              else
                newState.push(song.track)
              setSelectedTracks(newState)
            }}
          />)
      }
      )}
    </div>
  )
}
