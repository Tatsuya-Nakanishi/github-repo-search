'use client';

import React from 'react';
import { ClipLoader } from 'react-spinners';

export default function Component() {
  const size = 50;
  const color = '#ffffff';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <ClipLoader size={size} color={color} />
    </div>
  );
}
