import React from 'react'

// export const highlightText = (text, searchValue) => {
//     if (!searchValue) return text;

//     const regex = new RegExp(searchValue, 'gi');
//     return <span dangerouslySetInnerHTML={{ __html: text.replace(
//       new RegExp(searchValue, 'gi'),
//       (match) => `<mark style="background-color: yellow;">${match}</mark>`
//     )}} />
//   }
  
  const highlight = ({text, searchValue}) => {

    const regex = new RegExp(searchValue, 'gi');
    if (!searchValue) return (
      <>
        {text}
      </>
    );

    return <span dangerouslySetInnerHTML={{ __html: text.replace(
      new RegExp(searchValue, 'gi'),
      (match) => `<mark style="background-color: yellow;">${match}</mark>`
    )}} />
  }
  
  export default highlight