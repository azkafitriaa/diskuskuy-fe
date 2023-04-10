import styles from "@/styles/Forum.module.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { formatDate, formatTime } from '@/utils/util';
import { useState } from "react";

export default function PostComponent({post}) {

  console.log(post)
  const [tags, setTags] = useState((post.tag && typeof post.tag === 'string') ? [post.tag] : post.tag ? [...post.tag] : []);
  // const tags = ['Perkenalan', 'Cerita Pengalaman']
  return (
    <>
      <div className="container bg-white p-3 rounded flex flex-row space-between gap-5">
        <div className="flex flex-row justify-start">
          <div className="flex flex-col basis-1/6 gap-2 items-center">
            <div className="rounded-full">
              <img src="/teacher-img.png" />
            </div>
            <div className="bg-[#667DF8] px-2">Dosen</div>
          </div>
        </div>
        <div className="flex flex-col basis-5/6 gap-2">
          <div className="flex flex-col gap-1">
          <h3 className="font-bold text-2xl">{post.title ? post.title : post.user}</h3>
          <p className="text-xs">
            Thread dimulai oleh {post.title && <strong>{post.user}</strong>} pada {formatDate(post.date)} ({formatTime(post.date)} WIB)
          </p>
          <div>
            <p>Tags: {tags.map((tag, i) => 
                  <span key={i} className="text-[#2ECC71]">{tag}{i != tags.length-1 && <span> | </span>}</span>
                )
              }
            </p>
          </div>
          </div>
          <div className="h-1 w-5 bg-[#C4C4C4]"></div>
          <p className="text-sm">{post.content}</p>
          <div className="h-[0.5px] bg-[#C4C4C4]"></div>
          <div className='flex flex-row gap-2 items-center'>
            <a className="cursor-pointer text-xs">Balas <ExpandMoreIcon /></a>
            <div className="rounded-full shadow p-2 cursor-pointer"><img src='/like.png'></img></div>
          </div>
        </div>
      </div>
    </>
  );
}
