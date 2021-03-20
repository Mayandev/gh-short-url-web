import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const URL_REG = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
const GITHUB_OWNER = 'mayandev';
const GITHUB_REPO = 'gh-pages-url-shortener-db';
const DOMAIN = 'https://shorten.pro/';
function App() {
  useEffect(() => {
    getToken();
  }, []);

  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [isGenerate, setIsGenerate] = useState(false);
  const [token, setToken] = useState('');
  const [issuesNumber, setIssuesNumber] = useState(0);
  const [showResultURL, setShowResultURL] = useState(false);
  const [showGenerateError, setShowGenerateError] = useState(false);
  const inputRef = useRef();

  const getToken = async () => {
    const {
      data: { token },
    } = await axios.get(
      'https://service-q0fiubji-1254432069.gz.apigw.tencentcs.com/release/getToken'
    );
    setToken(token);
  };

  const onGenerate = async () => {
    setShowErrorMsg(false);
    // check is url invalid
    const url = inputRef.current.value;
    if (!URL_REG.test(url)) {
      setShowErrorMsg(true);
      return;
    }
    setIsGenerate(true);
    setShowResultURL(false);
    const options = {
      method: 'POST',
      headers: { 'Authorization': `token ${token}`},
      data: {
        title: url
      },
      url: `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`,
    };
    try {
      // send a request to generate surl in server
      const {
        data: { number },
      } = await axios(options);
      console.log(number);
      setIsGenerate(false);
      setIssuesNumber(number);
      setShowResultURL(true);
    } catch (error) {
      console.log('ssss', error);
      setShowGenerateError(true);
    }
  };
  return (
    <div className="form-container">
      <input placeholder="please input a link" ref={inputRef} />
      <br />
      {showErrorMsg && <div className="invalid-error-msg">Invalid link!</div>}
      <button onClick={onGenerate}>{isGenerate ? 'Generating' : 'Generate'}</button>
      {showResultURL && (
        <div>
          Successful! Your short link is :
          <a href={`${DOMAIN}${issuesNumber}`} target="_blank">{`${DOMAIN}${issuesNumber}`}</a>
        </div>
      )}
      {showGenerateError && (
        <div>
          <p>
            Oops...Something error, please contact{' '}
            <a href="mailto:phillzou@gmail.com">phillzou@gmail.com</a>
          </p>
        </div>
      )}
      <p>
        <a href="https://github.com/Mayandev/gh-short-url">Learn more about this URL shortener</a>
      </p>
    </div>
  );
}

export default App;
