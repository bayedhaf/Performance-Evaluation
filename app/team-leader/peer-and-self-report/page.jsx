'use client'
import { useState, useEffect } from "react";
import Image from "next/image";

export default function PeerAndSelfReportPage() {
  const [reportFile, setReportFile] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch('https://dummyjson.com/c/e221-4eb0-4d72-9a4c'); // Replace with your get API endpoint
        const data = await res.json();
        setReportFile(Array.isArray(data) ? data : []);
      } catch (err) {
        setReportFile([]);
      }
      setLoading(false);
    }
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="mb-25">
      <div className="fixed top-0 w-full"></div>
      <div className="min-h-screen bg-gray-100 flex flex-col gap-8 items-center justify-center py-8">
        {reportFile.map((user, index) => (
          <form
            key={index}
            action="/api/evaluations"
            method="GET"
            className="bg-white w-full mt-12 pt-12 pb-12 max-w-5xl border border-gray-400 rounded-lg shadow-md"
          >
           
            <div className="bg-indigo-400 text-white text-center p-4 border-b border-gray-400 rounded-t-lg">
              <Image
                src={user.employeeEvaluation.university.logo}
                height={100}
                width={100}
                alt="ASTU Logo"
                className="mx-auto w-20 h-20 mb-2 rounded-full"
              />
              <h1 className="text-xl font-bold">{user.employeeEvaluation.university.name}</h1>
              <p className="text-sm">
                1888 &nbsp;
                {user.employeeEvaluation.university.contact.phone} &nbsp;
                {user.employeeEvaluation.university.contact.fax} &nbsp;
                {user.employeeEvaluation.university.contact.email}
              </p>
              <p className="text-xs italic">{user.employeeEvaluation.university.department}</p>
            </div>

          
            <div className="grid grid-cols-2 border-b border-gray-400">
              <div className="bg-gray-200 p-2 text-center font-semibold">
                {user.employeeEvaluation.evaluationDetails.summary}
              </div>
              <div className="bg-gray-200 p-2 text-center font-semibold">
                {user.employeeEvaluation.evaluationDetails.term}
              </div>
            </div>

           
            <div className="p-4 border-b border-gray-400 grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Employee Name:</label>
                <p className="border w-full p-2 rounded h-10">{user.employeeEvaluation.employeeInfo.name}</p>
              </div>
              <div>
                <label className="block mb-1 font-medium">Type of work:</label>
                <p className="border w-full p-2 rounded h-10">{user.employeeEvaluation.employeeInfo.typeOfWork}</p>
              </div>
              <div>
                <label className="block mb-1 font-medium">Job type:</label>
                <p className="border w-full p-2 rounded h-10">{user.employeeEvaluation.employeeInfo.jobType}</p>
              </div>
              <div>
                <label className="block mb-1 font-medium">Year of evaluation:</label>
                <p className="border w-full p-2 rounded h-10">{user.employeeEvaluation.employeeInfo.yearOfEvaluation}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 col-span-2">
                <div>
                  <label className="block mb-1 font-medium">Sign:</label>
                  <p className="border w-full p-2 rounded h-10">{user.employeeEvaluation.employeeInfo.sign}</p>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Date:</label>
                  <p className="border w-full p-2 rounded h-10">{user.employeeEvaluation.employeeInfo.date}</p>
                </div>
              </div>
            </div>

         
            <div className="p-4 border-b border-gray-400 grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Self mark (5%):</label>
                <p className="border w-full p-2 rounded h-10">{user.employeeEvaluation.marks.selfMark5}</p>
              </div>
              <div>
                <label className="block mb-1 font-medium">Peer mark (15%):</label>
                <p className="border w-full p-2 rounded h-10">{user.employeeEvaluation.marks.peerMark15}</p>
              </div>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}