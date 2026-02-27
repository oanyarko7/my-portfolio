export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white p-24">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
        Hello, I'm Nyarko Osumanu Adamu 👋
      </h1>
      <p className="mt-4 text-xl text-slate-400">
        Computer Science Student & Explorer of the Universe.
      </p>
      
      <div className="mt-10 p-6 border border-slate-800 rounded-xl hover:border-blue-500 transition-colors">
        <h2 className="text-2xl font-semibold">Current Mission →</h2>
        <p>Building a portfolio to showcase my journey in computing.</p>
      </div>
    </main>
  )
}