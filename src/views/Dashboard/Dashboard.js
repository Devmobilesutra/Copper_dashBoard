import React, { Component } from 'react';


class Dashboard extends Component {
  state = {}
  render() {
    return (
      <div className='App'>
        <h1>Copper</h1>
        <div className="animated fadeIn">
          {/* <div style={{ display: }}>

          </div> */}
          <img src={require('../../assets/PARTHI_LOGO-01.jpg')} width={200} height={150} />
          {/* <Row>
                    <Card className="text-white bg-info">
                      <CardHeader>
                        <h3>Welcome!!</h3> 
                      </CardHeader>
                      <CardBody>                        
                        <h4>
                        Please Select Options from the drawer: <br/>
                        1. User List: To Check and Update Users List. <br/> 
                        2. Activity: To add,update,delete the activities.
                        3. Tip: To add,update,delete the Tips.
                        4. News: To add,update,delete the News.
                        5. User List: To check the User List.
                        6. Feedback List: To check Feedback List.
                        7. Daily Weekly Tip: To set Daily and Weekly Tip.
                        </h4>
                      </CardBody>
                    </Card>
                  </Row> */}
        </div>
        {/* <h4>About us</h4> */}
      </div>
    );
  }
}

export default Dashboard;