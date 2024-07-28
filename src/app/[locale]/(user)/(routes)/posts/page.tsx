import Posts from "@/components/pages/user/posts/posts-page";
import { createClient } from "@/lib/utils/supabase/server";
import { redirect } from "next/navigation";



const page = async() => {

   
    return (
        <div>
            <Posts/>
        </div>
    );
}

export default page;