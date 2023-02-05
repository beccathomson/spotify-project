import { useState, useEffect } from 'react';

export interface CheckboxProps {
    selected: boolean;
    onChangeCallback: (selected: boolean) => void,
    uriValue: string;
}

export function Checkbox(props: CheckboxProps) {
    const { selected, onChangeCallback, uriValue } = props;

    // useEffect(() => {
    // }, [selected]);

    return (<input value={uriValue} checked={selected} onChange={(e) => {
        onChangeCallback(e.target.checked);
    }} type="checkbox" />)
}