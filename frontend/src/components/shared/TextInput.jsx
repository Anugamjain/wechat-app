import React from 'react'

const TextInput = (props) => {
  return (
    <div >
      <input className='bg-[#323232] border-none' type="text" name="phone" required {...props}/>
    </div>
  )
}

export default TextInput
