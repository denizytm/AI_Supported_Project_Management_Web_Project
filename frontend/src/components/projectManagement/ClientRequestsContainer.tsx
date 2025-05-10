import { ProjectRequestType } from "@/types/projectType";

interface ClientRequestsContainerProps {
  projectRequests: ProjectRequestType[];
  setSelectedRequest: (value: any) => void;
  setIsCompleted: (value: React.SetStateAction<boolean>) => void;
  setCompletionNote: (value: React.SetStateAction<string>) => void;
}

export default function ClientRequestsContainer({
  projectRequests,
  setCompletionNote,
  setIsCompleted,
  setSelectedRequest,
}: ClientRequestsContainerProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 shadow-md rounded-md max-h-[400px] overflow-auto">
      <h3 className="font-bold text-gray-700 dark:text-white mb-2">
        Client Requests
      </h3>

      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full text-left ">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-3 py-2">Critic</th>
              <th className="px-3 py-2">Request</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {projectRequests &&
              projectRequests
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((request) => (
                  <tr
                    key={request.id}
                    className={`border-b hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                      request.isClosed ? "opacity-50" : ""
                    }`}
                  >
                    <td
                      className={
                        "px-3 py-2 font-semibold whitespace-nowrap " +
                        (request.criticLevelName === "Low"
                          ? "text-green-500"
                          : request.criticLevelName === "Medium"
                          ? "text-yellow-500"
                          : request.criticLevelName === "High"
                          ? "text-red-500"
                          : "text-red-700")
                      }
                    >
                      {request.criticLevelName}
                    </td>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300 max-w-[180px] truncate">
                      {request.description}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        className="text-blue-500 hover:text-blue-700 font-semibold"
                        onClick={() => {
                          setSelectedRequest(request);
                          setIsCompleted(request.isClosed || false);
                          setCompletionNote(request.closingNote || "");
                        }}
                        disabled={request.isClosed}
                      >
                        {request.isClosed ? "Done" : "See"}
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
