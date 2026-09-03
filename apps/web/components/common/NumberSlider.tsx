'use client';
import { DualRangeSlider } from '@/components/ui/slider';
import React, { useState } from 'react';

interface NumberSliderProps {
  value: number[];
  onChange: (value: number[]) => void;
  minimum: number;
  maximum: number;
}

export default function NumberSlider({value, onChange, minimum, maximum}: NumberSliderProps) {
  const [values, setValues] = useState(value);

  return (
    <>
      <div className='w-full mx-auto py-3 text-white'>
        <DualRangeSlider
          label={() => <></>}
          lableContenPos='left'
          labelPosition='bottom'
          value={values}
          onValueChange={(value) => {
            setValues(value);
            onChange(value);
          }}
          min={minimum}
          max={maximum}
          step={1}
        />
      </div>
    </>
  );
}
