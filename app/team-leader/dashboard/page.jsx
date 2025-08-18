'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function Page() {
  const router = useRouter();

  const handleTaskChange = (e) => {
    const value = e.target.value;
    if (value === '70') {
      router.push('leader-taskform1'); 
    } else if (value === '10') {
      router.push('leader-taskform2'); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      <main className="flex-1 p-4 sm:p-8 space-y-10 mb-32">
        
      
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            className="w-full p-4 rounded-xl border border-gray-200 shadow-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition hover:shadow-md"
          />
        </div>

       
        <div className="flex flex-wrap justify-center gap-3 bg-white shadow-lg p-4 rounded-xl max-w-4xl mx-auto border border-gray-100 hover:shadow-xl transition-shadow">
          {[
            { name: 'Overview', link: 'overview' },
            { name: 'Board', link: 'board' },
            { name: 'Calendar', link: 'calendar' },
          ].map((tab) => (
            <Link
              key={tab.name}
              href={tab.link}
              className="text-sm font-semibold text-gray-700 px-5 py-2 rounded-xl hover:bg-indigo-100 hover:text-indigo-600 transition-all shadow-sm"
            >
              {tab.name}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
        
          <Card className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
              Team Leader Tasks Evaluation
            </h1>
            <form className="w-full">
              <select
                defaultValue=""
                onChange={handleTaskChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:bg-[#8D92EB] hover:border-[#8D92EB] transition"
              >
                <option value="" disabled>
                  Select Task type
                </option>
                <option value="70">Task out of 70%</option>
                <option value="10">Task out of 10%</option>
              </select>
            </form>
          </Card>

        
          <Card className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
              Employee Tasks
            </h1>
            <div className="flex flex-col gap-4">
              <Link
                href="/team-leader/peer-evaluation"
                className="bg-[#8D92EB] rounded-xl text-white font-semibold text-center px-4 py-3 shadow-md hover:from-indigo-600 hover:to-indigo-700 transition-all"
              >
                + Create Peer Tasks
              </Link>
              <Link
                href="/team-leader/self-evaluationform"
                className="bg-[#8D92EB] rounded-xl text-white font-semibold text-center px-4 py-3 shadow-md hover:from-indigo-600 hover:to-indigo-700 transition-all"
              >
                + Create Self-Evaluation Tasks
              </Link>
            </div>
          </Card>

        </div>
      </main>
    </div>
  );
}
