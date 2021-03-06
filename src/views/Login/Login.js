import React, { Component } from 'react';
import '../../App.css';
import {
  Button, Card, CardBody, CardGroup, Col, Container,
  Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import fire from '../../fire';
import firebase from 'firebase';
import {reactLocalStorage} from 'reactjs-localstorage';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // username:'',
      // password:'',
      UsernameErr: '',
      PasswordErr: '',
      redirect: false,
      user:[],
      flag:'',
      //name:''

      newLoginData: {
        username: '',
        password: '',
      },
    }


    this.login = this.login.bind(this);
    // this.onChange = this.onChange.bind(this);
  }


  componentDidMount() {
    console.log("Hey bro you did it");
        fire.firestore().collection('Users_admin').onSnapshot(data => {
            this.setState({ user: [] });
            data.forEach(el => {
                console.log("el", el.data())
         
                    this.state.user.push(el.data())


            })
            console.log("user name", this.state.user);
        })

    }

  validate = () => {
    let UsernameErr = '';
    let PasswordErr = '';

    if (!this.state.newLoginData.username) {
      UsernameErr = 'Please Enter Username';
    }
    if (!this.state.newLoginData.password) {
      PasswordErr = 'Please Enter Password';
    }

    if (UsernameErr || PasswordErr) {
      this.setState({ UsernameErr, PasswordErr });


      return false;
    }
    return true;
  }

  login() {
    const isValid = this.validate();

    if (isValid) {
      var len=this.state.user.length
      for(var i=0;i<len;i++)
      {
      if (this.state.newLoginData.username ==this.state.user[i].Username && this.state.newLoginData.password ==this.state.user[i].Password) {
        reactLocalStorage.set('username', this.state.user[i].Name);
        // this.setState({flag:true})
        this.setState({ redirect: true })
        break;
      }
      }
      // if(this.state.flag!==true)
      // {
      //   alert(" Wrong username or password")
      // }

  }

  }
  render() {

    if (this.state.redirect) {
      return (<Redirect to={'/Welcome'} />)
    }

    return (
    
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Username" autoComplete="username"
                          value={this.state.newLoginData.username} onChange={(e) => {
                            let { newLoginData } = this.state;
                            newLoginData.username = e.target.value;
                            this.setState({ newLoginData });
                          }}
                        />
                      </InputGroup>
                      <div style={{ fontSize: 12, color: "red" }}>{this.state.UsernameErr}</div>

                      <br />

                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" autoComplete="current-password"
                          value={this.state.newLoginData.password} onChange={(e) => {
                            let { newLoginData } = this.state;
                            newLoginData.password = e.target.value;
                            this.setState({ newLoginData });
                          }} />
                      </InputGroup>
                      <div style={{ fontSize: 12, color: "red" }}>{this.state.PasswordErr}</div>


                      <br />
                      <Row>
                        <Col xs="6">
                          <Button type="submit" color="primary" className="px-4" value="Login" onClick={this.login} >
                            Login</Button>
                          {/* type=submit for enter submit */}
                          {/* <input type="submit" value="Login" className="button" onClick={this.login}/> */}
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;