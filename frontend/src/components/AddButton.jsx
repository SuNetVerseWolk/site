import React from 'react'

const AddButton = ({ children }) => {
  return (
    <>
      <button>
        <img src="/heading.png" alt="..." />
      </button>
      <button>
        <img src="/text.png" alt="..." />
      </button>
      <button disabled>
        <img src="/delete.png" alt="..." />
      </button>
    </>
  )
}

export default AddButton
