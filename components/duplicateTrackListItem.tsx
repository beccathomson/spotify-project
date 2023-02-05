import React from 'react';
import { Checkbox } from './checkbox';

export interface DuplicateTrackListItemProps {
  selected: boolean;
  trackName: string;
  trackArtistName: string;
  uriValue: string;
  onChange: () => void;
}

export const DuplicateTrackListItem = (props: DuplicateTrackListItemProps) => {
  const { selected, trackName, trackArtistName, uriValue, onChange } = props;
  return (
    <li key={uriValue} className="songRow">
      <span>
        <span>{trackName}</span> <span className="gray">by</span>{' '}
        <span>{trackArtistName}</span>
      </span>
      <Checkbox selected={selected}
        onChangeCallback={onChange}
        uriValue={uriValue} ></Checkbox>
      <style jsx>
        {`
        .gray {
          color: #999;
        }

        .songRow {
          display: flex;
          justify-content: space-between;
        }
      `}
      </style>
    </li>
  );
};



