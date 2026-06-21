import { X, UserCheck, UserX } from "lucide-react";
import { useState } from "react";

export default function TrainerDetailsModal({
  trainer,
  close,
  onApprove,
  onReject
}) {
  const [feedback, setFeedback] = useState("");

  const handleApproveAction = () => {
  if (onApprove && trainer?._id) {
    onApprove(trainer._id, feedback); 
  }
};

const handleRejectAction = () => {
  if (onReject && trainer?._id) {
    onReject(trainer._id, feedback); 
  }
};

  if (!trainer) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 overflow-y-auto">
      {/* Modal Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 transform transition-all animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              Trainer Details
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Applicant: {trainer.name}
            </p>
          </div>

          <button 
            onClick={close}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 md:p-6 space-y-6">
          
          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Experience
              </p>
              <h3 className="font-semibold text-base md:text-lg text-slate-800 dark:text-slate-200 mt-1">
                {trainer.experience || "Not Specified"}
              </h3>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Specialty
              </p>
              <h3 className="font-semibold text-base md:text-lg text-slate-800 dark:text-slate-200 mt-1">
                {trainer.specialty || "Not Specified"}
              </h3>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 sm:col-span-2">
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Available Time
              </p>
              <h3 className="font-semibold text-base md:text-lg text-slate-800 dark:text-slate-200 mt-1">
                {trainer.availableTime || "Not Specified"}
              </h3>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
              Admin Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              placeholder="Write standard feedback or reason for approval/rejection..."
              className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <button
              onClick={handleRejectAction}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-sm bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-950/70 dark:text-red-400 transition-colors"
            >
              <UserX size={16} />
              Reject Application
            </button>

            <button
              onClick={handleApproveAction}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-sm bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-sm shadow-emerald-600/10 transition-colors"
            >
              <UserCheck size={16} />
              Approve Trainer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}