import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import styles from "@/styles/Forum.module.css";
import axios from "axios";
import { useRouter } from "next/router";

export default function DiscussionAnalytics({ reply, nestedReply, analytics }) {
  const router = useRouter()
  const [showExpansion, setShowExpansion] = useState(false);
  const [datas, setDatas] = useState(null)

  const toggleShowExpansion = () => {
    setShowExpansion((prevShowExpansion) => !prevShowExpansion);
  };

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_BE_URL}/forum/analytics/${router.query.pid}`,  {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    }).then((result) => setDatas(result?.data))
  }, [])


  const data = {
    replies: analytics.replies,
    participants: analytics.participants,
    not_particapated: analytics.non_participants,
    tags: {
      pendapat:
      datas?.tags?.pendapat ?? 0,
      pertanyaan:
      datas?.tags?.pertanyaan ?? 0,
      bingung:
      datas?.tags?.bingung ?? 0,
    },
  };

  return (
    <div className="section">
      <h5 className="font-bold text-gray">Statistik Diskusi</h5>
      <div className="h-1 w-5 bg-grey"></div>
      <div className="flex flex-row">
        <div className="flex flex-col basis-1/3 items-center">
          <h1 className="font-bold">{data["replies"]}</h1>
          <p className="text-xs">jawaban</p>
        </div>
        <div className="flex flex-col basis-1/3 items-center">
          <h1 className="font-bold">{data["participants"]}</h1>
          <p className="text-xs">jumlah</p>
          <p className="text-xs">peserta diskusi</p>
        </div>
        <div className="flex flex-col basis-1/3 items-center">
          <h1 className="font-bold">{data["not_particapated"]}</h1>
          <p className="text-xs">belum menjawab</p>
          <p className="text-xs">sama sekali</p>
        </div>
      </div>
      <a
        onClick={toggleShowExpansion}
        className="cursor-pointer text-xs text-gray font-bold"
      >
        {!showExpansion && (
          <>
            <span>Lihat selengkapnya</span>
            <ExpandMoreIcon />
          </>
        )}
        {showExpansion && (
          <>
            <span>Sembunyikan</span>
            <ExpandLessIcon />
          </>
        )}
      </a>
      {showExpansion && (
        <>
          <h5 className="font-bold text-gray">Jumlah Tag Posting</h5>
          <div className="h-1 w-5 bg-grey"></div>
          <div className="flex flex-col text-xs">
            <div className="flex flex-row justify-between text-green">
              <p>Pendapat</p>
              <p>{data["tags"]["pendapat"]}</p>
            </div>
            <div className="flex flex-row justify-between text-green">
              <p>Pertanyaan</p>
              <p>{data["tags"]["pertanyaan"]}</p>
            </div>
            <div className="flex flex-row justify-between text-green">
              <p>Bingung</p>
              <p>{data["tags"]["bingung"]}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
