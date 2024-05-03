import Loading from 'components/Loading'
import React from 'react'

const TextEditor = ({ className, text, isLoading }) => {
  return (
    <>
      {isLoading ? (
        <div className={className} >
          <Loading />
        </div>
      ) : (
        <div
          className={className}
          contentEditable
          dangerouslySetInnerHTML={{ __html: text }}
        ></div>
      )}
    </>
  )
}

export default TextEditor
