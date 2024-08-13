import Link from "next/link";

const page = ({ params }: { params: { companyId:string; } } )=> {
  return (
    <div>
<Link href={`/profile/companyprofile/${params.companyId}/tenders/new`} >click her</Link> e  </div>
  );
}

export default page;


