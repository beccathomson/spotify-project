import { SpotifyTrackType } from '@/dedup/spotifyApi';
import React, { useEffect, useState } from 'react';
import { DuplicateTrackListItem } from './duplicateTrackListItem';
import { SelectAll } from './selectAll';

export interface TrackListProps {
  playlistId: string;
  childTracks: Array<SpotifyTrackType>;
  selectionCallback: (playlistId: string, selectedTracks: Array<SpotifyTrackType>) => void;
  initialSelectedTracks?: Array<SpotifyTrackType>;
}

export const DuplicateTrackList = (props: TrackListProps): JSX.Element => {
  const { childTracks, playlistId, selectionCallback, initialSelectedTracks = [] } = props;
  console.log(initialSelectedTracks);
  const [selectedTracks, setSelectedTracks] = useState(initialSelectedTracks);
  useEffect(() => {
    console.log(selectedTracks);
    selectionCallback(playlistId, selectedTracks);
  }, [selectedTracks]);

  return (
    <div>
      <SelectAll playlistId={playlistId} onChange={(selected) => {
        if (selected) {
          setSelectedTracks(childTracks);
        }
        else {
          setSelectedTracks([]);
        }
      }} />
      {childTracks.map((track) => {
        return (
          <DuplicateTrackListItem
            selected={selectedTracks.includes(track)}
            trackName={track.name}
            trackArtistName={track.artists[0].name}
            uriValue={track.uri}
            onChange={() => {
              let newState = [...selectedTracks];
              if (selectedTracks.includes(track))
                newState = newState.filter((selectedTrack) => selectedTrack.id !== track.id)
              else
                newState.push(track)
              setSelectedTracks(newState)
            }}
          />)
      }
      )}
    </div>
  )
}
