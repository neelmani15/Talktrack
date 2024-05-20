import React, { useEffect ,useState} from 'react';

const AuthPage = () => {
    const [loginStatus, setLoginStatus] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('success')) {
          setLoginStatus('success');
        }
      }, []);
  const handleClick = ()=>{
    const url= `http://localhost:5001/auth/google`;
    console.log(url);
    window.location.href = url;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
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
  );
};

export default AuthPage;
