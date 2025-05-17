export const Error500Illustration = () => {
    return (
      <div className="relative w-full max-w-[280px] mx-auto">
        <svg
          className="w-full h-auto"
          viewBox="0 0 480 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M448.25 256.25C448.25 256.25 442 234.25 423.5 243.75C405 253.25 410.5 272.25 410.5 272.25L448.25 256.25Z"
            fill="#F4F7FF"
          />
          <path
            d="M341.5 18.5C374.5 45.5 411.5 76.5 421 117.5C430.5 158.5 412.5 209.5 379.5 247.5C346.5 285.5 298.5 310.5 249.5 316.5C200.5 322.5 150.5 309.5 111.5 282C72.5 254.5 44.5 212.5 37.5 166.5C30.5 120.5 44.5 70.5 76.5 40C108.5 9.5 158.5 -1.5 203.5 0.5C248.5 2.5 308.5 -8.5 341.5 18.5Z"
            fill="#F9FAFB"
          />
          
          {/* Server rack */}
          <rect x="160" y="100" width="160" height="220" rx="8" fill="#E5E7EB" />
          <rect x="170" y="110" width="140" height="200" rx="4" fill="#FDFDFD" stroke="#D1D5DB" strokeWidth="1" />
          
          {/* Server units */}
          <rect x="180" y="120" width="120" height="30" rx="2" fill="#F43F5E" stroke="#FB7185" strokeWidth="1" />
          <rect x="190" y="130" width="40" height="10" rx="1" fill="#FFFFFF" fillOpacity="0.6" />
          <circle cx="290" cy="135" r="5" fill="#FFFFFF" />
          <circle cx="275" cy="135" r="5" fill="#FFFFFF" />
          
          <rect x="180" y="160" width="120" height="30" rx="2" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1" />
          <rect x="190" y="170" width="40" height="10" rx="1" fill="#FFFFFF" fillOpacity="0.6" />
          <circle cx="290" cy="175" r="5" fill="#FFFFFF" />
          
          <rect x="180" y="200" width="120" height="30" rx="2" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1" />
          <rect x="190" y="210" width="40" height="10" rx="1" fill="#FFFFFF" fillOpacity="0.6" />
          <circle cx="290" cy="215" r="5" fill="#FFFFFF" />
          
          <rect x="180" y="240" width="120" height="30" rx="2" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1" />
          <rect x="190" y="250" width="40" height="10" rx="1" fill="#FFFFFF" fillOpacity="0.6" />
          <circle cx="290" cy="255" r="5" fill="#FFFFFF" />
          
          {/* Error elements */}
          <circle cx="240" cy="70" r="20" fill="#FEE2E2" />
          <path
            d="M230 60L250 80"
            stroke="#F43F5E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M250 60L230 80"
            stroke="#F43F5E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Electrical elements */}
          <path
            d="M190 80C190 80 160 50 120 90"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <path
            d="M290 80C290 80 320 50 360 90"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          
          {/* Error code */}
          <rect x="200" y="280" width="80" height="25" rx="4" fill="#F9FAFB" />
          <text
            x="240" 
            y="300"
            fontFamily="system-ui"
            fontSize="18"
            fontWeight="bold"
            fill="#F43F5E"
            textAnchor="middle"
          >
            500
          </text>
          
          {/* Animated elements */}
          <circle cx="120" cy="90" r="6" fill="#F43F5E" className="animate-ping opacity-75" style={{animationDuration: "2s"}} />
          <circle cx="360" cy="90" r="6" fill="#F43F5E" className="animate-ping opacity-75" style={{animationDuration: "2.5s"}} />
        </svg>
        
        {/* Sparkles effect */}
        <div className="absolute top-20 left-10 animate-pulse" style={{animationDuration: "1.5s"}}>
          <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
        </div>
        <div className="absolute top-40 right-20 animate-pulse" style={{animationDuration: "2s"}}>
          <div className="h-2 w-2 rounded-full bg-red-400"></div>
        </div>
        <div className="absolute bottom-20 left-20 animate-pulse" style={{animationDuration: "1.8s"}}>
          <div className="h-2 w-2 rounded-full bg-red-400"></div>
        </div>
      </div>
    );
  };
  
