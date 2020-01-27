import { CogniteClient } from '@cognite/sdk';
import React from 'react';
import styled from 'styled-components';
import { LoginForm, LoginFormParams } from './LoginForm';
import { Menu } from './Menu';

const Container = styled.div`
  padding: 4px;
`;

type AppContextType = {
  client: CogniteClient | null;
  project: string;
  loggedIn: boolean;
  onLogin: (arg0: LoginFormParams) => void;
  onLogout: () => void;
} | null;

interface StateType {
  token: string;
  app: AppContextType;
  msg: string;
}

const APP_ID = 'gearbox-examples';

const AppContext = React.createContext<AppContextType>(null);

const { Provider } = AppContext;

class App extends React.Component<{}, StateType> {
  constructor(props: any) {
    super(props);

    this.state = {
      token: '',
      app: {
        client: null,
        project: '',
        loggedIn: false,
        onLogin: this.handleLogin,
        onLogout: this.handleLogout,
      },
      msg: '',
    };
  }

  async componentDidMount() {
    const project = localStorage.getItem('project');
    const token = localStorage.getItem('token');

    if (!project || !token) {
      return;
    }

    this.handleLogin({ project, token });
  }

  handleLogin = async ({ project, token }: LoginFormParams) => {
    const client: CogniteClient = new CogniteClient({
      appId: APP_ID,
    });

    client.loginWithApiKey({
      project,
      apiKey: token,
    });

    const status = await client.login.status();
    if (status === null) {
      this.setState({ msg: 'Login-failed: invalid token' });
      return;
    }

    this.setState(state => ({
      token,
      app: {
        client,
        project,
        loggedIn: true,
        onLogin: state.app!.onLogin,
        onLogout: state.app!.onLogout,
      },
      msg: '',
    }));

    localStorage.setItem('project', project);
    localStorage.setItem('token', token);
  };

  handleLogout = () => {
    localStorage.removeItem('project');
    localStorage.removeItem('token');
    this.setState(state => ({
      token: '',
      app: {
        client: null,
        project: '',
        loggedIn: false,
        onLogin: state.app!.onLogin,
        onLogout: state.app!.onLogout,
      },
      msg: '',
    }));
  };

  render() {
    return this.state.app!.loggedIn ? (
      <Provider value={this.state.app}>
        <div>
          <Menu />
          {this.props.children}
        </div>
      </Provider>
    ) : (
      <Container>
        <LoginForm
          onTokenSelected={({ project, token }: LoginFormParams) => {
            this.state.app!.onLogin({ project, token });
          }}
        >
          Login
        </LoginForm>
        <div>{this.state.msg}</div>
      </Container>
    );
  }
}

export { App, AppContext, AppContextType };
