import Posts from "@/components/pages/user/posts/posts-page";
import { prisma } from '@/lib/prisma'
import { redirect } from "next/navigation";



const page = async() => {

   
    return (
        <div>
            <Posts/>
        </div>
    );
}

export default page;