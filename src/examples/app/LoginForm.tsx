import React, { FC, MouseEvent, useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  form {
    padding: 4px;
    background-color: #fbf9f3;
  }

  button:enabled {
    background-color: #c3f7eb;
  }

  button:disabled {
    background-color: #ffc5c9;
  }
`;

interface LoginFormParams {
  project: string;
  token: string;
}

interface LoginFormProps {
  onTokenSelected: (params: LoginFormParams) => void;
}

const LoginForm: FC<LoginFormProps> = ({ onTokenSelected }) => {
  const [project, setProject] = useState('publicdata');
  const [token, setToken] = useState('');

  return (
    <FormContainer>
      <form
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gridGap: '10px',
        }}
      >
        <label>&nbsp;</label>
        <div>
          <p>
            Please log-in to your Cognite Data Fusion project with an API Key.
          </p>
        </div>
        <label>Project Name</label>
        <input
          type="text"
          value={project}
          onChange={event => setProject(event.target.value)}
        />
        <label>Access Token</label>
        <input
          type="text"
          value={token}
          onChange={event => setToken(event.target.value)}
        />
        <label>&nbsp;</label>
        <button
          type="submit"
          onClick={(evt: MouseEvent) => {
            evt.preventDefault();
            onTokenSelected({ project, token });
          }}
          disabled={!project || !token}
        >
          Log-in to Cognite Data Fusion
        </button>
        <label>&nbsp;</label>
        <div>
          <p>
            <strong>Note:</strong> If you don't have a project yet, get a free
            API Key to the <code>publicdata</code> tenant from the
            <span>&nbsp;</span>
            <a href="https://openindustrialdata.com/get-started/">
              Open Industrial Data
            </a>
            <span>&nbsp;</span>project.
          </p>
        </div>
      </form>
    </FormContainer>
  );
};

export { LoginForm, LoginFormProps, LoginFormParams };
