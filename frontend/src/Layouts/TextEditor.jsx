import Loading from 'components/Loading'
import React from 'react'
import ReactHtmlParser from 'html-react-parser'

const TextEditor = ({ itsRef, className, text, isLoading, isEditable }) => {
  return (
    <>
      {isLoading ? (
        <div className={className} >
          <Loading />
        </div>
      ) : (
        <div
          ref={itsRef}
          className={className}
          contentEditable={isEditable}
        >
          {text ? ReactHtmlParser(text) : ''}
        </div>
      )}
    </>
  )
}

export default TextEditor
