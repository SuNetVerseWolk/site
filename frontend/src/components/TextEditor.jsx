import React from 'react'

const RGB_HEX = rgb => {
  let eachNumber = rgb.split("(")[1].split(")")[0].split(",")

  eachNumber = eachNumber.map(x => {
    x = parseInt(x).toString(16);
    return (x.length == 1) ? "0" + x : x;
  }).join("")

  return '#' + eachNumber
}

const TextEditor = ({ ref, className }) => {
  return (
    <div ref={ref} className={className} contentEditable></div>
  )
}

export default TextEditor
