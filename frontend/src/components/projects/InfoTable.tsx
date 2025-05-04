export interface InfoTableProps {
  generalInfo: {
    projectCount: number;
    finishedProjectCount: number;
    onGoingProjectCount: number;
    onHoldProjectCount: number;
  };
  projectTypes: {
    erp: number;
    web: number;
    mobile: number;
    application: number;
    ai: number;
  };
}

export default function InfoTable({ generalInfo, projectTypes }: InfoTableProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* General Information */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-lg font-bold mb-4 text-gray-700 dark:text-white">
          📊 General Information
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
          <li>
            ✅ Total Projects: <strong>{generalInfo.projectCount}</strong>
          </li>
          <li>
            🏁 Finished Projects:{" "}
            <strong>{generalInfo.finishedProjectCount}</strong>
          </li>
          <li>
            🚧 Ongoing Projects:{" "}
            <strong>{generalInfo.onGoingProjectCount}</strong>
          </li>
          <li>
            🚧 Onhold Projects:{" "}
            <strong>{generalInfo.onHoldProjectCount}</strong>
          </li>
        </ul>
      </div>

      {/* Distribution by Project Type */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-lg font-bold mb-4 text-gray-700 dark:text-white">
          📂 Distribution by Project Type
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
          <li>
            🧾 ERP: <strong>{projectTypes.erp}</strong>
          </li>
          <li>
            💻 Web: <strong>{projectTypes.web}</strong>
          </li>
          <li>
            📱 Mobile: <strong>{projectTypes.mobile}</strong>
          </li>
          <li>
            🧩 Application: <strong>{projectTypes.application}</strong>
          </li>
          <li>
            🤖 AI: <strong>{projectTypes.ai}</strong>
          </li>
        </ul>
      </div>
    </div>
  );
}
