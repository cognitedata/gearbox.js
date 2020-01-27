import React, { MouseEvent, useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from './App';

const ExpandingLogoutButton = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  background-color: black;
  z-index: 9999999;

  .btn {
    float: right;
    width: 30px;
    padding: 2px;
    margin: 2px;
    overflow: hidden;
    color: white;
    background-color: black;
    text-decoration: none;

    transition: width 0.35s;
    -webkit-transition: width 0.35s;
  }

  img {
    float: left;
    width: 25px;
    border-radius: 50px;
  }

  .project {
    font-size: 0.8em;
    font-family: sans-serif;
    position: relative;
    right: -18px;
    bottom: -4px;
    overflow: hidden;
    letter-spacing: 3px;
    opacity: 0;
    transition: opacity 0.45s;
    -webkit-transition: opacity 0.35s;
  }

  a:hover {
    width: 150px;
  }

  a:hover .project {
    opacity: 0.9;
  }

  a {
    text-decoration: none;
  }
`;

const Menu: React.FC = () => {
  const ctx = useContext(AppContext);

  if (!ctx) {
    return <div>Context not available</div>;
  }

  if (!ctx.loggedIn) {
    return <div>Not logged-in</div>;
  }

  return (
    <ExpandingLogoutButton>
      <a
        className="btn"
        href=""
        onClick={(event: MouseEvent) => {
          event.preventDefault();
          ctx.onLogout();
        }}
      >
        <img src="docs/logout.png" />

        <div className="project">{ctx.project}</div>
      </a>
    </ExpandingLogoutButton>
  );
};

export { Menu };
