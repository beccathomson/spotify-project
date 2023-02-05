import React from 'react';

export interface SelectAllProps {
  playlistId: string;
  onChange: (selected: boolean, playlistId: string) => void;
}

export const SelectAll = (props: SelectAllProps) => {
  const { playlistId, onChange } = props;
  return (<span>
    <label>Select All </label>
    <input value={playlistId} onChange={(e) => onChange(e.target.checked, playlistId)} type="checkbox" >
    </input>
  </span>
  );
};



