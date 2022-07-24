import React from 'react'
import Button from '@mui/material/Button';

const CommonButton = ({children, color, disabled, size}: {children:any, color:any, disabled:boolean, size:any}) => {
  return (
    <Button
      color={color}
      disabled={disabled}
      size={size}
    >
      {children}
    </Button>
  )
}

export default CommonButton
