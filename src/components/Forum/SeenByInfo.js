export default function SeenByInfo({photoUrl, name, role, group}) {
  return (
    <div className='flex flex-row items-center gap-2'>
      <div className='rounded-full h-8 w-8'>
        <img src={photoUrl ? photoUrl : "/images/default-prof-pic.png"} className="h-8 w-8 rounded-full object-cover" />
      </div>
      <div className='flex flex-col'>
          <p className='font-bold text-[#6B6B6B] text-xs'>{name}</p>
          <div className="flex flex-row gap-2">
            <div className="px-2 text-white" style={{background: '#4CBFAC'}}><p className="text-xs">{role == 'lecturer' ? 'Dosen' : 'Mahasiswa'}</p></div>
            {group && <div className="px-2 text-black" style={{background: '#EED56B'}}><p className="text-xs">Group {group}</p></div>}
          </div>
      </div>
    </div>
  )
}
