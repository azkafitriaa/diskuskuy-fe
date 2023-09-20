export default function DosenInfo({photoUrl, name, nim}) {
  return (
    <div className='flex flex-row items-center gap-2'>
      <div className='rounded-full h-16 w-16'>
          <img src={photoUrl ? photoUrl : "/images/default-prof-pic.png"} className="h-16 w-16 rounded-full object-cover" />
      </div>
      <div className='flex flex-col'>
          <p className='font-bold'> {name}</p>
          <p>{nim}</p>
      </div>
    </div>
  )
}
