import * as React from "react"
import Svg, { Defs, Path, G, Mask, Use,ClipPath,Rect } from "react-native-svg"

function Password(props) {
  return (
    <Svg
    width={17}
    height={19}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M14.333 8.65H2.667c-.92 0-1.667.761-1.667 1.7v5.95c0 .939.746 1.7 1.667 1.7h11.666c.92 0 1.667-.761 1.667-1.7v-5.95c0-.939-.746-1.7-1.667-1.7ZM4.333 8.65v-3.4c0-1.127.44-2.208 1.22-3.005A4.126 4.126 0 0 1 8.5 1c1.105 0 2.165.448 2.946 1.245a4.294 4.294 0 0 1 1.22 3.005v3.4"
      stroke="#9B9797"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
    
    
  )
}

export default Password;





// 1. 📅 Date of Birth Icon
export function DateOfBirthIcon(props) {
  return (
    <Svg width={20} height={20} fill="none" {...props}>
      <Path
        d="M15 2v2M5 2v2M3 7h14M4 4h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z"
        stroke="#9B9797"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 2. 💰 Income Range Icon
export function IncomeRangeIcon(props) {
  return (
    <Svg width={20} height={20} fill="none" {...props}>
      <Path
        d="M10 1v18M14 5H8.5a2.5 2.5 0 100 5h3a2.5 2.5 0 010 5H6M10 1a9 9 0 110 18 9 9 0 010-18z"
        stroke="#9B9797"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 3. ⚥ Gender Icon
export function GenderIcon(props) {
  return (
    <Svg width={20} height={20} fill="none" {...props}>
      <Path
        d="M10 11a4 4 0 100-8 4 4 0 000 8zM10 11v5M7 16h6"
        stroke="#9B9797"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 4. 🧾 PAN Number Icon
export function PanNumberIcon(props) {
  return (
    <Svg width={20} height={20} fill="none" {...props}>
      <Path
        d="M3 3h14a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zM6 8h8M6 11h8M6 14h4"
        stroke="#9B9797"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


// 🛡️ Broker Code Icon
export function BrokerCodeIcon(props) {
  return (
    <Svg width={20} height={20} fill="none" {...props}>
      <Path
        d="M10 2L4 5v4c0 5 3.5 8 6 9 2.5-1 6-4 6-9V5l-6-3z"
        stroke="#9B9797"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 8h4M8 11h2"
        stroke="#9B9797"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}