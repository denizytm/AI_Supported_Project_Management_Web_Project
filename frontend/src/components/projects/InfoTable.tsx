export default function InfoTable() {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow">
        <h3 className="font-semibold mb-2">General Information</h3>
        <ul className="text-sm">
          <li>Total Projects: 13</li>
          <li>Finished Projects: 22</li>
          <li>Ongoing Projects: 11</li>
          <li>Delayed Projects: 1</li>
          <li>Projects on Risk: 3</li>
          <li>Total Connections: 27</li>
          <li>Total Errors: 12</li>
        </ul>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow">
        <h3 className="font-semibold mb-2">Distribution by Project Type</h3>
        <ul className="text-sm">
          <li>ERP: 1</li>
          <li>Web: 2</li>
          <li>Mobile: 1</li>
          <li>Application: 2</li>
          <li>AI: 5</li>
        </ul>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow">
        <h3 className="font-semibold mb-2">Time Line</h3>
        <p className="text-sm">Start Date: 05/05/1998</p>
        <p className="text-sm">End Date: 31/12/2025</p>
      </div>
    </div>
  );
}
