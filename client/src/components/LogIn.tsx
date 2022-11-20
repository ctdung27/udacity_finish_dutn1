import * as React from 'react'
import Auth from '../auth/Auth'
import { Button, Container,Header, Icon } from 'semantic-ui-react'

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div>
        <Container text >
          <Header as='h2' icon textAlign='center'>
            <Icon name='list ul' circular />
          </Header>

          <Header
            as='h1' color='blue'
            content='-----TASK UDACITY-----'
            textAlign='center'
            style={{
              fontSize: '4em',
              marginBottom: '1em',
            }}
          />
          <Header as='h2' icon textAlign='center'>
          <Button primary onClick={this.onLogin} size="huge">
            Log in
          </Button> 
          </Header>
        </Container>
        
      </div>
    )
  }
}
