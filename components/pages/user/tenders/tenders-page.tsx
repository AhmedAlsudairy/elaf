'use client'
import TenderInfiniteScrollList from "./components/tender-list";

const TendersPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tenders</h1>
      <TenderInfiniteScrollList />
    </div>
  );
};

export default TendersPage;