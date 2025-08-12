'use client'
import Image from "next/image";

export default function PerformanceEvaluationResualt() {
  return (
    <div className="min-h-screen mb-20 bg-gray-100 flex justify-center py-8">
      <form 
        action="/api/evaluations" 
        method="GET" 
        className="bg-white w-full mb-15 max-w-5xl border border-gray-400 rounded-lg shadow-md"
      >
        
        <div className="bg-indigo-400  text-white text-center p-4 border-b border-gray-400 rounded-t-lg">
          <Image src="/image/astuLogo.png" 
          height={100} width={100}
          alt="ASTU Logo" className="mx-auto w-20 h-20 mb-2 rounded-full" />
          <h1 className="text-xl font-bold">ADAMA SCIENCE AND TECHNOLOGY UNIVERSITY</h1>
          <p className="text-sm">1888 &nbsp; phone:0916656489 &nbsp; fax:+234890 747 &nbsp; email: example@f.com</p>
          <p className="text-xs italic">Vice president for strategic management and international relations</p>
        </div>

      
        <div className="grid grid-cols-2 border-b border-gray-400">
          <div className="bg-gray-200 p-2 text-center font-semibold">
            The employee evaluation summary
          </div>
          <div className="bg-gray-200 p-2 text-center font-semibold">
            Evaluation term half year
          </div>
        </div>

     
        <div className="p-4 border-b border-gray-400 grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Employee Name:</label>
             <p  className="border w-full p-2 rounded h-10">bayisa balcha</p> 
          </div>
          <div>
            <label className="block mb-1 font-medium">Type of work:</label>
           <p  className="border w-full p-2 rounded h-10">development</p> 
           
          </div>
          <div>
            <label className="block mb-1 font-medium">Job type:</label>
             <p  className="border w-full p-2 rounded h-10">software</p> 
          </div>
          <div>
            <label className="block mb-1 font-medium">Year of evaluation:</label>
            <p  className="border w-full p-2 rounded h-10">2022</p> 
          </div>
          <div>
            <label className="block mb-1 font-medium">Evaluation leader:</label>
             <p  className="border w-full p-2 rounded h-10">Engineer B</p> 
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 font-medium">Sign:</label>
             <p  className="border w-full p-2 rounded h-10">bayisa</p> 
            </div>
            <div>
              <label className="block mb-1 font-medium">Date:</label>
              <p  className="border w-full p-2 rounded h-10">8/10/2022</p> 
            </div>
          </div>
        </div>

   
        <div className="p-4 border-b border-gray-400 grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Leader mark (70%):</label>
              <p  className="border w-full p-2 rounded h-10">65</p> 
          </div>
          <div>
            <label className="block mb-1 font-medium">Self mark (5%):</label>
             <p  className="border w-full p-2 rounded h-10">4.5</p> 
          </div>
          <div>
            <label className="block mb-1 font-medium">Leader mark (10%):</label>
            <p  className="border w-full p-2 rounded h-10">9</p> 
          </div>
          <div>
            <label className="block mb-1 font-medium">Peer mark (15%):</label>
            <p  className="border w-full p-2 rounded h-10">14.3</p> 
          </div>
        </div>

    
        <div className="p-4">
          <label className="block mb-1 font-medium">Evaluation summary:</label>
            <p  className="border w-full p-2 rounded h-10">
              good</p> 
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block mb-1 font-medium">Approver Name:</label>
                           <p  className="border w-full p-2 rounded h-10">Dr. D</p> 
            </div>
            <div>
              <label className="block mb-1 font-medium">Sign:</label>
                          <p  className="border w-full p-2 rounded h-10">D olin</p> 
            </div>
            <div>
              <label className="block mb-1 font-medium">Date:</label>
                          <p  className="border w-full p-2 rounded h-10">8/10/2022</p> 
            </div>
          </div>
        </div>

     
        <div className="p-4 text-center border-t border-gray-400">
       
        </div>
      </form>
    </div>
  );
}