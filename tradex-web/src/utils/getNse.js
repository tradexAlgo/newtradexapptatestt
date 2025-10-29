import axios from "axios";



import CookieManager from '@react-native-cookies/cookies';
import { baseURLExport } from "./baseURL";

// export const fetchOptionChain = async (symbol = 'NIFTY') => {
//   try {
//     // Step 1: Fetch NSE homepage to get cookies
//     await axios.get('https://www.nseindia.com', {
//       headers: {
//         'User-Agent': 'Mozilla/5.0',
//         'Accept': 'text/html',
//       },
//     });

//     // Step 2: Read cookies
//     const cookies = await CookieManager.get('https://www.nseindia.com');
//     const cookieStr = Object.entries(cookies)
//       .map(([key, val]) => `${key}=${val.value}`)
//       .join('; ');

//     // Step 3: Now call option chain API with cookies
//     const response = await axios.get(
//       `https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`,
//       {
//         headers: {
//           'User-Agent': 'Mozilla/5.0',
//           'Accept': 'application/json',
//           'Referer': 'https://www.nseindia.com/option-chain',
//           'Cookie': cookieStr,
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error('Option chain fetch failed:', error);
//     throw error;
//   }
// };



// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// export const fetchOptionChain = async (symbol = 'NIFTY') => {
//   try {
//     console.log('🔄 Fetching NSE homepage for session setup...');

//     // Step 1: Visit NSE homepage to set cookies
//     await axios.get('https://www.nseindia.com', {
//       headers: {
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
//         'Accept': 'text/html,application/xhtml+xml',
//         'Accept-Encoding': 'gzip, deflate',
//         'Accept-Language': 'en-US,en;q=0.9',
//         'Connection': 'keep-alive',
//       }
//     });

//     // Wait a bit to simulate real user
//     await delay(500);

//     // Step 2: Get stored cookies
//     const cookies = await CookieManager.get('https://www.nseindia.com');
//     const cookieStr = Object.entries(cookies)
//       .map(([key, val]) => `${key}=${val.value}`)
//       .join('; ');

//     console.log('📡 Fetching option chain for', symbol);

//     // Step 3: Make real API call with all headers and cookies
//     const response = await axios.get(
//       `https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`,
//       {
//         headers: {
//           'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
//           'Accept': 'application/json, text/plain, */*',
//           'Accept-Language': 'en-US,en;q=0.9',
//           'Referer': `https://www.nseindia.com/option-chain`,
//           'Cookie': cookieStr,
//           'Connection': 'keep-alive',
//           'Cache-Control': 'no-cache',
//           'Pragma': 'no-cache',
//           'Upgrade-Insecure-Requests': '1',
//         },
//         timeout: 7000, // handle slow connection
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error('❌ Option chain fetch failed:', error);
//     throw error;
//   }
// };



export const fetchOptionChainOLD = async (symbol = 'NIFTY') => {
    // console.log("is compatible with",symbol)
    try {
        const response = await axios.get(`https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Accept': 'application/json',
                'Referer': 'https://www.nseindia.com/',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        });

        // Log or use the response
        // console.log('Option Chain Data:', response.data);
        return response.data;

    } catch (error) {
        console.error('Error fetching option chain data:', error.message);
        throw error;
    }
};


// export const fetchOptionChain = async (symbol = 'NIFTY') => {
//     console.log("is compatible with",symbol)
//     try {
//         const response = await axios.get(`https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`, {
//             headers: {
//                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
//                 'Accept': 'application/json',
//                 'Referer': 'https://www.nseindia.com/',
//                 'Accept-Language': 'en-US,en;q=0.9',
//                 'Cache-Control': 'no-cache',
//                 'Connection': 'keep-alive'
//             }
//         });

//         // Log or use the response
//         console.log('Option Chain Data:', response.data);
//         return response.data;

//     } catch (error) {
//         console.error('Error fetching option chain data:', error.message);
//         throw error;
//     }
// };





// export const fetchOptionChain = async (symbol = 'NIFTY') => {
//   try {
//     console.log('📡 Calling backend for option chain:', symbol);

//     const response = await axios.get(`${baseURLExport}/market/chain?index=${symbol}`);

//     return response?.data;
//   } catch (error) {
//     console.error('❌ Option chain fetch failed:', error);
//     throw error;
//   }
// };



import Cookies from '@react-native-cookies/cookies';

export const fetchOptionChain = async (symbol = 'NIFTY') => {
  // console.log('🌐 Starting cookie-aware NSE fetch', symbol);

  try {
    // 1️⃣ First: Load NSE landing page to get cookies
    await axios.get('https://www.nseindia.com/option-chain', {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    // 2️⃣ Get cookies for nseindia.com
    const allCookies = await Cookies.get('https://www.nseindia.com');
    // console.log('🍪 Cookies:', allCookies);

    const cookieHeader = Object.entries(allCookies)
      .map(([key, value]) => `${key}=${value.value}`)
      .join('; ');

    // 3️⃣ Use cookies in API call
    const response = await axios.get(
      `https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Cookie': cookieHeader,
          'Referer': 'https://www.nseindia.com/option-chain',
          'Accept': 'application/json',
        },
      }
    );

    // console.log('✅ Option Chain Data:', response.data);
    return response.data;

  } catch (error) {
    console.error('❌ Error fetching option chain data:', error.message);
    throw error;
  }
};
