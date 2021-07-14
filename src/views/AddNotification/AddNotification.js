import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Container, Row, Col, Progress } from 'reactstrap';
import firebase from 'firebase';

export default class AddNotification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationList: [],

            title: null,
            content: null,

            screen_message_title: '',
            screen_message: '',

            ImageUploadingStatus: '',
            imageProgress: false,
            file: '',
            isLoading: false,

            //Add Images
            percentUploaded: null,

            ProgressBar: false,
           
            storageRef: firebase.storage().ref(),
      
            uploadTask: null,
          
            //Add Product data
            Add_productData: {
               
                Image_Name1: '',
              
            },
        };
    }

    componentDidMount() {
        console.log('component did mount');
        // const messaging = firebase.messaging();

        // messaging.onMessage((payload) => {
        //     console.log('Message received. ', payload);
        //     // ...
        // });

        // messaging.getToken({ vapidKey: 'BIUEhFK-jNVCO4tSxGtEeJxi7Eiu8BK-8bSKYyZM2T4KFxt4zFS36cWYFNzqhXU6j-yBdDLNsr0V04kP8Tt6IYQ' }).then(token => {
        //     console.log(token);
        //     if (token) {
        //         console.log(token);
        //     } else {
        //         console.log("Not available");
        //     }
        // })
        firebase.firestore().collection('notifications').orderBy("date", "desc").onSnapshot((data) => {
            var list = [];
            data.forEach(element => {
                list.push({ id: element.id, ...element.data() })
            })
            console.log(list);
            this.setState({ notificationList: list });
        })
    }

    sent() {
        const { title, content } = this.state;
        console.log('this is sent notification function', title, content);

        if (title === null || title == '') {
            alert('Either `Title` field id empty or null, please make sure you entered something!');
            return
        }
        if (content === null || content == '') {
            alert('Either `content` field id empty or null, please make sure you entered something!');
            return
        }

        firebase.firestore().collection('notifications').add({
            title,
            content,
            type: 'Push Notification',
            date: new Date()
        })
            .then(() => {
                console.log('added successfully');
                // var sendPush_notification = firebase.functions().httpsCallable('sendPush_notification');
                // sendPush_notification({
                //     title: title,
                //     content: content
                // })
                //     .then((result) => {
                //         // Read result of the Cloud Function.
                //         console.log("result", result);
                //     })
                //     .catch((err) => {
                //         console.log('Error: ', err);
                //     })
            });
    }
    async Upload_Image(Img) {
       
        console.log("image for firebaseImg", Img);
     
        // const uploadTask = await firebase.storage().ref(`/Images/${Img.name}`).put(Img);
        this.setState({
            uploadTask: this.state.storageRef.child(`Notification/${Img.name}`).put(Img)
        }, 
            () => {
                this.state.uploadTask.on(
                    'state_changed',
                    () => {
                      
                    },
                    err => {
                        console.error(err);
                    },
                    () => {
                        this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                            console.log('this is the image url', downloadUrl);
                               this.setState({url1:downloadUrl})
                           

                        })
                            .catch(err => {
                                console.error(err);
                            })
                    }
                )
            }
        )
    }
    async sent_screen_message() {
        const { screen_message, screen_message_title, Image } = this.state;
        if (screen_message_title === null || screen_message_title == '') {
            alert('Either `Screen Message Title` field empty or null, please make sure you entered something!');
            return
        }

        if (screen_message === null || screen_message == '') {
            alert('Either `Screen Message` field empty or null, please make sure you entered something!');
            return
        }

        if (Image === null || Image == '', Image === undefined) {
            alert('Either `Screen Message Image` empty or null, please make sure you entered something!');
            return
        }

        console.log('this is screen message funtion', Image);
        this.setState({ imageProgress: true }, () => console.log('imageProgress', this.state.imageProgress)); // for showing image uploading progress
        var ImageUrl = ''; // for adding url into firestore
        const upload_status = firebase.storage().ref().child(`Notification/${Image.name}`).put(Image);
        await upload_status.on(
            'state_changed',
            snap => {
                const ImageUploadingStatus = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                this.setState({ ImageUploadingStatus });
            },
            err => {
                console.error(err);
            },
            () => {
                upload_status.snapshot.ref.getDownloadURL()
                    .then(downloadUrl => {
                        console.log('this is the image url', downloadUrl);
                        ImageUrl = downloadUrl;
                        this.setState({ imageProgress: false }, () => console.log('imageProgress', this.state.imageProgress)); // for showing image uploading progress
                        firebase.firestore().collection('notifications').add({
                            title: screen_message_title,
                            content: screen_message,
                            type: 'Screen Message',
                            date: new Date(),
                            image: ImageUrl
                        })
                            .then(sucess => console.log('Uploaded succefully', sucess))
                            .catch(error => console.error(error));
                    })
                    .catch(err => {
                        console.error(err);
                    })
            }
        )
       
    }

    render() {
        const { notificationList } = this.state;
        return (
            <div>
                <Container>
                    {/* <Button>Function</Button> */}
                    <Row>
                        <Col>
                            <h1>Push Notification</h1>
                            <Form>
                                <FormGroup row>
                                    <Label for="Notification Title" sm={2}>Notification Title</Label>
                                    <Col sm={10}>
                                        <Input type="email" name="Notification_Title" id="Notification Title" placeholder="Title of notification"
                                            onChange={(e) => this.setState({ title: e.target.value })}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="Notification-content" sm={2}>Notification content</Label>
                                    <Col sm={10}>
                                        <Input type="textarea" name="Notification" id="Notification-content" placeholder="Title of notification"
                                            onChange={(e) => this.setState({ content: e.target.value })}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup check row>
                                    <Col sm={{ size: 10, offset: 2 }}>
                                        <Button onClick={() => this.sent()}>Submit</Button>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </Col>
                        <Col>
                            <h1>Mobile Screen Messages</h1>
                            {this.state.imageProgress ? <h2>Uploading Status</h2> : null}
                            {this.state.imageProgress ? <Progress value={this.state.ImageUploadingStatus} /> : null}
                            <Form>
                                <FormGroup row>
                                    <Label for="Notification Title" sm={2}>Notification Title</Label>
                                    <Col sm={10}>
                                        <Input type="email" name="Notification_Title" id="Notification Title" placeholder="Title of notification"
                                            onChange={(e) => this.setState({ screen_message_title: e.target.value })}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="Notification-content" sm={2}>Notification content</Label>
                                    <Col sm={10}>
                                        <Input type="textarea" name="Notification" id="Notification-content" placeholder="Title of notification"
                                            onChange={(e) => this.setState({ screen_message: e.target.value })}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="exampleFile">Select Picture to upload</Label>
                                    <Col sm={10}>
                                        <input type="file" name="file" id="exampleFile"
                                            onChange={(e) => { console.log(e.target.files[0]); this.setState({ Image: e.target.files[0] }); this.Upload_Image(e.target.files[0]) }}
                                        />
                                    </Col>
                                    {this.state.url1?<img src={this.state.url1} style={{ width: 200, height: 100 }}></img>:this.state.Image?<text style={{color:'red'}}>Wait till Image get upload</text>:null}
                                    <FormText color="muted">
                                        {/* This is some placeholder block-level help text for the above input.
                                        It's a bit lighter and easily wraps to a new line. */}
                                    </FormText>
                                </FormGroup>
                                <FormGroup check row>
                                    <Col sm={{ size: 10, offset: 2 }}>
                                        <Button onClick={() => this.sent_screen_message()}>Submit</Button>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                    <h1>Sent Notification</h1>
                    <Row>
                        <div style={{ width: '100%', height: 500, overflowX: 'hidden', overflowY: 'auto', textAlign: 'justify' }}>
                            {notificationList.map((data, index) => (
                                <div key={index} style={{ margin: 4, backgroundColor: 'lightgrey', borderRadius: 15, padding: 15 }}>
                                    <Container>
                                        <Col>
                                            <Row>
                                                <Col sm={3}><strong>Type of notification:</strong></Col>
                                                <Col sm={4}>{data.type}</Col>
                                                <Col>Date: {new Date(data.date.seconds * 1000).toLocaleDateString("en-US")}</Col>
                                            </Row>
                                            <Row>
                                                <Col sm={3}><strong>Notification Title:</strong></Col>
                                                <Col sm={8}>{data.title}</Col>                                                
                                            </Row>
                                            <Row>
                                                <Col sm={3}><strong>Notification Content:</strong></Col>
                                                <Col>{data.content}</Col>
                                                <Col sm={4}> {data.type=='Screen Message'?<img src={data.image} style={{ width: 200, height: 150 }}></img>:null}</Col>
                                            </Row>
                                        </Col>
                                    </Container>
                                    {/* <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                        <CardTitle tag="h3">{data.title}</CardTitle>
                                        <CardTitle>{data.type}</CardTitle>
                                    </div>
                                    <CardText>{data.content}</CardText>
                                    <CardText>{new Date(data.date.seconds * 1000).toLocaleDateString("en-US")}</CardText> */}
                                    {/* <CardText>{data.date.toDate()}</CardText> */}
                                </div>
                            ))}
                        </div>
                    </Row>
                </Container>

            </div>
        );
    }
}