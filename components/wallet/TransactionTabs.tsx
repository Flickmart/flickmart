type TransactionTabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile?: boolean;
};

export default function TransactionTabs({
  activeTab,
  setActiveTab,
  isMobile = false,
}: TransactionTabsProps) {
  const tabTextSize = isMobile ? 'text-sm' : 'text-base';
  const tabPadding = isMobile ? 'p-2 py-[2px]' : 'pb-3';
  const activeBackgroundPadding = isMobile ? '-m-1' : '-m-2';
  const activeBackgroundRadius = isMobile
    ? 'rounded-full'
    : 'rounded-full px-5 py-2';

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'deposits', label: 'Deposits' },
    { id: 'withdrawals', label: 'Withdrawals' },
  ];

  return (
    <div className={`mb-${isMobile ? '4' : '6'}`}>
      <div
        className={`flex ${isMobile ? 'gap-6' : 'items-center justify-around'}`}
      >
        {tabs.map((tab) => (
          <button
            className={`relative ${tabPadding} font-medium ${tabTextSize} transition-colors ${
              activeTab === tab.id
                ? 'text-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {activeTab === tab.id && (
              <div
                className={`${activeBackgroundPadding} absolute inset-0 ${activeBackgroundRadius} bg-orange-100`}
              />
            )}
            <span className="relative">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-orange-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
