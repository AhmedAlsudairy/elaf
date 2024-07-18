export default function NotFoundPage() {
  return (
    <html>

      <body>
          <main className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 lg:p-16 text-center max-w-xs md:max-w-md lg:max-w-lg">
          <h1 className="font-bold text-red-600 text-3xl md:text-4xl lg:text-5xl mb-4">Error</h1>
          <p className="font-bold text-black-500 text-xl md:text-2xl lg:text-3xl">Page not found 404</p>
        </div>
      </main>

      </body>
    
    </html>
  );
}
