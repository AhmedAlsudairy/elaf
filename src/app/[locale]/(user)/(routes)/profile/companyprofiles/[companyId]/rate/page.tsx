import { getCompanyRatings } from "@/actions/supabase/add-rating";
import InfiniteScrollRatings from "@/components/common/user/rating/infinte-scrol-rating";
import CompanyRatingHeader from "@/components/common/user/rating/rating-header";

const Page = async ({ params }: { params: { companyId: string } }) => {
    const ratings = await getCompanyRatings(params.companyId);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Company Ratings</h1>
                
                <div className="mb-10">
                    <CompanyRatingHeader ratings={ratings} />
                </div>
                
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Reviews</h2>
                    <InfiniteScrollRatings companyId={params.companyId} />
                </div>
            </div>
        </div>
    );
}

export default Page;