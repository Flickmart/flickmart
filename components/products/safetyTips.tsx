
const SafetyTips = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="font-semibold mb-4">Safety Tips</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-red-500">•</span>
            <span>Avoid paying to the seller directly, use the escrow service</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">•</span>
            <span>Meet the seller or delivery person in a public place</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">•</span>
            <span>Inspect the item carefully to ensure it matches your expectation</span>
          </li>
        </ul>
      </div>
    );
  };
  
  export default SafetyTips;
  