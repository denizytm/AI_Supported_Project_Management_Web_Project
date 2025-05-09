import { ProjectType } from "@/types/projectType";

interface ClientInfoContainerProps {
  projectData: ProjectType;
}

export default function ClientInfoContainer({
  projectData,
}: ClientInfoContainerProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 shadow-md rounded-md">
      <h3 className="font-bold text-gray-700 dark:text-white mb-2">
        Client Information
      </h3>
      <p className="text-gray-500 dark:text-gray-300">
        <strong>Name:</strong> {projectData.customer.name}{" "}
        {projectData.customer.lastName}
      </p>
      <p className="text-gray-500 dark:text-gray-300">
        <strong>Company:</strong> {projectData.customer.company}
      </p>
      <p className="text-gray-500 dark:text-gray-300">
        <strong>Email:</strong> {projectData.customer.email}
      </p>
      <p className="text-gray-500 dark:text-gray-300">
        <strong>Phone:</strong> {projectData.customer.phone}
      </p>
    </div>
  );
}
