'use client'
import React, { useState } from 'react';

const ToggleSwitch = ({
  isChecked,
  handleCheckboxChange,
	onClick
}: {
  isChecked?: boolean;
  handleCheckboxChange?: () => void;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) => {
  // Use internal state if no external state is provided
  const [internalChecked, setInternalChecked] = useState(false);

  // Determine the current state of the checkbox
  const checked = isChecked !== undefined ? isChecked : internalChecked;

  // Handle the change by calling the passed function or using internal state
  const onChange = () => {
    if (handleCheckboxChange) {
      handleCheckboxChange();
    } else {
      setInternalChecked((prevState) => !prevState);
    }
  };

  return (
    <>
      <label className='flex cursor-pointer select-none items-center'>
        <div className='relative'>
          <input
            type='checkbox'
            checked={checked}
            onChange={onChange}
            className='sr-only'
          />
          <div
            className={`block h-8 w-14 rounded-full ${
              checked ? 'bg-green-500' : 'bg-black/50'
            }`}
          ></div>
          <div
            className={`dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${
              checked ? 'translate-x-6' : ''
            }`}
          ></div>
        </div>
      </label>
    </>
  );
};

export default ToggleSwitch;
