'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PerformanceEvaluationResult() {
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvaluation() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/employee/evaluation-results");
        if (!res.ok) {
          throw new Error('Failed to fetch evaluation results');
        }
        const data = await res.json();
        if (data.success && data.evaluation) {
          setEvaluation(data.evaluation);
        } else {
          setError(data.message || 'No evaluation results found');
        }
      } catch (err) {
        console.error("Error fetching evaluation:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvaluation();
  }, []);

  const handleDownloadPDF = async () => {
    const element = document.getElementById("evaluation-form");
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("performance_evaluation.pdf");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">No evaluation results found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
     
      <div
        id="evaluation-form"
        className="bg-white w-full max-w-5xl border border-gray-300 rounded-2xl shadow-lg overflow-hidden"
      >
      
        <div className="bg-indigo-400 text-white text-center py-6 px-4 relative">
          <Image
            src="/image/astuLogo.png"
            height={100}
            width={100}
            alt="ASTU Logo"
            className="mx-auto w-24 h-24 rounded-full mb-2 border-4 border-white shadow-md"
          />
          <h1 className="text-2xl font-bold mb-1">ADAMA SCIENCE AND TECHNOLOGY UNIVERSITY</h1>
          <p className="text-sm">1888 &nbsp; phone:0916656489 &nbsp; fax:+234890 747 &nbsp; email: example@f.com</p>
          <p className="text-xs italic mt-1">Vice president for strategic management and international relations</p>
        </div>

     
        <div className="grid grid-cols-2 bg-gray-200 border-b border-gray-300">
          <div className="p-3 text-center font-semibold border-r border-gray-300">Employee Evaluation Summary</div>
          <div className="p-3 text-center font-semibold">Evaluation Term: Half Year</div>
        </div>

      
        <div className="p-6 grid grid-cols-2 gap-6 border-b border-gray-300">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Employee Name:</label>
            <p className="border w-full p-2 rounded h-10">{evaluation.name}</p>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Type of Work:</label>
            <p className="border w-full p-2 rounded h-10">{evaluation.work}</p>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Job Type:</label>
            <p className="border w-full p-2 rounded h-10">{evaluation.job}</p>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Year of Evaluation:</label>
            <p className="border w-full p-2 rounded h-10">{evaluation.year}</p>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Evaluation Leader:</label>
            <p className="border w-full p-2 rounded h-10">{evaluation.leader}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Sign:</label>
              <p className="border w-full p-2 rounded h-10">{evaluation.leaderSign}</p>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Date:</label>
              <p className="border w-full p-2 rounded h-10">{evaluation.leaderDate}</p>
            </div>
          </div>
        </div>

      
        <div className="p-6 grid grid-cols-2 gap-6 border-b border-gray-300">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Leader Mark (70%):</label>
            <p className="border w-full p-2 rounded h-10">{evaluation.leaderMark}</p>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Self Mark (5%):</label>
            <p className="border w-full p-2 rounded h-10">{evaluation.selfMark}</p>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Peer Mark (15%):</label>
            <p className="border w-full p-2 rounded h-10">{evaluation.peerMark}</p>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Other Mark (10%):</label>
            <p className="border w-full p-2 rounded h-10">{evaluation.otherMark}</p>
          </div>
        </div>

       
        <div className="p-6">
          <label className="block mb-1 font-medium text-gray-700">Evaluation Summary:</label>
          <p className="border w-full p-2 rounded h-10">{evaluation.summary}</p>
          <div className="grid grid-cols-3 gap-6 mt-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Approver Name:</label>
              <p className="border w-full p-2 rounded h-10">{evaluation.approver}</p>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Sign:</label>
              <p className="border w-full p-2 rounded h-10">{evaluation.approverSign}</p>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Date:</label>
              <p className="border w-full p-2 rounded h-10">{evaluation.approverDate}</p>
            </div>
          </div>
        </div>
      </div>

   
      <div className="mt-8">
        <button
          onClick={handleDownloadPDF}
          className="px-8 mb-28 py-3 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white font-semibold rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
