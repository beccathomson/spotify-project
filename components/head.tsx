import React from 'react';

const Head = () => {
  return (
    <div className="flex items-center mb-6 mx-4 md:mx-0">
      <h3>
        <img src='./logo.svg' />
        <span className="text">Spotify Funky Project</span>
      </h3>
      <style jsx>
        {`
          .nav {
            padding-left: 0;
            margin-bottom: 0;
            list-style: none;
          }
          .nav > li {
            position: relative;
            display: block;
          }
          .nav > li > a {
            position: relative;
            display: block;
            padding: 10px 15px;
          }
          h3 {
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 0;
            line-height: 40px;
            display: flex;
            flex-shrink: 0;
            flex-grow: 1;
            color: indigo;
          }
          @media (prefers-color-scheme: dark) {
            h3 {
              color: lightorchid;
            }
          }
          @media (max-width: 600px) {
            .text {
              display: none;
            }
          }
          ul {
            float: right;
            margin: 0;
            padding: 0;
            order: 1;
          }
          img {
            width: 50px;
            height: 40px;
            margin: 0 10px;
          }
        `}
      </style>
    </div>
  );
};

export default Head;
