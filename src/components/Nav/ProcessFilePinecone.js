import React from 'react'

import { Button } from '@mui/material'

export default function UploadFile() {
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          console.log('clicked')
        }}
      >
        Process File
      </Button>
    </div>
  )
}