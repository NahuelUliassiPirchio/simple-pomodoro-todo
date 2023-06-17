import Image from 'next/image'

export default function IconButton ({ srcIcon, handleClick, info }) {
  return (
    <button
      className='align-self-center border-0 bg-transparent cursor-pointer p-0'
      title={info}
      onClick={handleClick}
    >
      <Image
        src={srcIcon}
        alt={info}
        width={30}
        height={30}
      />
    </button>
  )
}
