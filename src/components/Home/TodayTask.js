import { formatDateDeadline } from "@/utils/util"
import { getCookie } from "cookies-next"
import Link from "next/link"

export default function TodayTask({thread}) {
    const userId = parseInt(JSON.parse(getCookie("auth"))?.user_id)
    const isDone = thread.user_done.filter((user) => user.id == userId).length > 0

    return (
        <div className="flex flex-row border rounded-lg p-3 gap-1 justify-between">
            <div className="flex flex-col gap-1">
            <p className="text-xs">Aktivitas Forum:</p>
            <p className="font-bold text-xs">{thread.title}</p>
            <div className="bg-red text-white px-2 text-xs">Deadline: {formatDateDeadline(thread.deadline)}</div>
            <Link href={"/forum/" + thread.id}>
                <button className="bg-transparent hover:bg-green text-green text-xs font-semibold hover:text-white py-2 px-4 border border-green hover:border-transparent rounded-lg">
                Lihat
                </button>
            </Link>
            </div>
            <div className="flex flex-col gap-1">
            <input
                type="checkbox"
                checked={isDone}
                disabled={isDone}
            />
            </div>
        </div>
    )
  }
  