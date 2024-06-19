// import React, { useEffect ,useState} from 'react';

// const AuthPage = () => {
//     const [loginStatus, setLoginStatus] = useState(null);

//     useEffect(() => {
//         const params = new URLSearchParams(window.location.search);
//         if (params.get('success')) {
//           setLoginStatus('success');
//         }
//       }, []);
//   const handleClick = ()=>{
//     const url= `http://localhost:5001/auth/google`;
//     console.log(url);
//     window.location.href = url;
//   }
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-md">
//         <h2 className="text-2xl font-bold mb-4">Sign in with Google</h2>
//         {loginStatus === 'success' ? (
//           <div className="text-green-500 font-bold mb-4">Successfully logged in!</div>
//         ) : (
//           <div
//             id="google-signin-button"
//             className="w-full py-2 rounded bg-blue-500 text-white font-bold cursor-pointer flex items-center justify-center"
//             onClick={handleClick}
//           >
//             Sign in with Google
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AuthPage;


// import React, { useEffect, useState } from 'react';

// const AuthPage = () => {
//   const [loginStatus, setLoginStatus] = useState(null);

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     if (params.get('success')) {
//       setLoginStatus('success');
//     }
//   }, []);

//   const handleClick = () => {
//     const url = `http://localhost:5001/auth/google`;
//     console.log(url);
//     window.location.href = url;
//   };

//   return (
//     <>
   
//     <div className="min-h-screen flex items-center bg-black">
      
//       <div className="w-1/2 flex flex-col items-center justify-center bg-black p-8 pr-10 mr-10 rounded shadow-md">
//         <h1 className="text-4xl font-bold text-center mb-4 text-white">Automate your meeting notes</h1>
//         <p className="text-lg text-center mb-8 text-white">
//         Transcribe, summarize, search, and analyze all your voice conversations.
//         </p>
//         <div className="flex flex-col items-center">
//           <h2 className="text-2xl font-bold mb-4">Sign in with Google</h2>
//           {loginStatus === 'success' ? (
//             <div className="text-green-500 font-bold mb-4">Successfully logged in!</div>
//           ) : (
//             <div
//               id="google-signin-button"
//               className="w-full py-2 rounded bg-blue-500 text-white font-bold cursor-pointer flex items-center justify-center"
//               onClick={handleClick}
//             >
//               Sign in with Google
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="w-1/2 mr-10 flex items-center justify-center">
//         <img
//           src="https://cdn.dribbble.com/users/1708816/screenshots/15637339/media/2ea4a194c3149189c2507d137f81a652.gif"
//           alt="Sign in Illustration"
//           className="rounded shadow-md max-w-md max-h-xs object-contain"
//         />
//       </div>
//     </div>
//     </>
//   );
// };

// export default AuthPage;



// import React, { useEffect, useState } from 'react';
// import TypingEffect from './TypingEfffect';

// const AuthPage = () => {
//   const [loginStatus, setLoginStatus] = useState(null);

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     if (params.get('success')) {
//       setLoginStatus('success');
//     }
//   }, []);

//   const handleClick = () => {
//     const url = `http://localhost:5001/auth/google`;
//     console.log(url);
//     window.location.href = url;
//   };

//   const messages = [
//     'Automate your meeting notes',
//     'Transcribe, summarize, search, and analyze all your voice conversations.',
//     'We will take care of your meeting notes.'
//   ];

//   return (
//     <div className="min-h-screen flex items-center bg-black">
//       <div className="w-1/2 flex flex-col items-center justify-center bg-black p-8 pr-10 mr-10 rounded shadow-md">
//         <TypingEffect messages={messages} />
//         <div className="flex flex-col items-center">
//           <h2 className="text-2xl font-bold mb-4">Sign in with Google</h2>
//           {loginStatus === 'success' ? (
//             <div className="text-green-500 font-bold mb-4">Successfully logged in!</div>
//           ) : (
//             <div
//               id="google-signin-button"
//               className="w-full py-2 rounded bg-blue-500 text-white font-bold cursor-pointer flex items-center justify-center"
//               onClick={handleClick}
//             >
//               Sign in with Google
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="w-1/2 mr-10 flex items-center justify-center">
//         <img
//           src="https://cdn.dribbble.com/users/1708816/screenshots/15637339/media/2ea4a194c3149189c2507d137f81a652.gif"
//           alt="Sign in Illustration"
//           className="rounded shadow-md max-w-md max-h-xs object-contain"
//         />
//       </div>
//     </div>
//   );
// };

// export default AuthPage;



import React, { useEffect, useState } from 'react';
import TypingEffect from 'react-typing-effect';

const AuthPage = () => {
  const [loginStatus, setLoginStatus] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) {
      setLoginStatus('success');
    }
  }, []);

  const handleClick = () => {
    const url = `${process.env.REACT_APP_API_URL}/auth/google`
    console.log(url);
    window.location.href = url;
  };

  return (
    <>
      <div className="fixed top-4 left-4 text-white text-2xl font-bold">
        <TypingEffect text={['Riktam.ai']} speed={100} eraseSpeed={50} typingDelay={200} />
      </div>

      <div className="min-h-screen flex items-center bg-black">
        <div className="w-1/2 flex flex-col items-center justify-center bg-black p-8 pr-10 mr-10 rounded shadow-md">
          <h1 className="text-4xl font-bold text-center mb-4 text-white">Automate your meeting notes</h1>
          <p className="text-lg text-center mb-8 text-white">
            Transcribe, summarize, search, and analyze all your voice conversations.
          </p>
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Sign in with Google</h2>
            {loginStatus === 'success' ? (
              <div className="text-green-500 font-bold mb-4">Successfully logged in!</div>
            ) : (
              <div
                id="google-signin-button"
                className="w-full py-2 rounded bg-blue-500 text-white font-bold cursor-pointer flex items-center justify-center"
                onClick={handleClick}
              >
                Sign in with Google
              </div>
            )}
          </div>
        </div>
        <div className="w-1/2 mr-10 flex items-center justify-center">
          <img
            src="https://cdn.dribbble.com/users/1708816/screenshots/15637339/media/2ea4a194c3149189c2507d137f81a652.gif"
            alt="Sign in Illustration"
            className="rounded shadow-md max-w-md max-h-xs object-contain"
          />
        </div>
      </div>
    </>
  );
};

export default AuthPage;
