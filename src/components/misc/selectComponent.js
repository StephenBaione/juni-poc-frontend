import React, { useState } from 'react';

import { InputLabel, Select, MenuItem } from '@mui/material';

export default function SelectComponent(props) {
    const {
        label,
        values,
        valueLabels,
        handleChange,
    } = props;

    const [selectValue, setSelectValue] = useState('');

    const handleSelectChange = (event) => {
        setSelectValue(event.target.value);
        handleChange(event.target.value);
    };

  return (
    <div>
        <Select
            label={label}
            onChange={handleSelectChange}
            value={selectValue}
        >
            {values?.map((value, index) => {
                return (
                    <MenuItem key={`${label}-select-${index}`} value={value}>{valueLabels[index]}</MenuItem>
                )}
            )}
        </Select>
    </div>
  )
}
