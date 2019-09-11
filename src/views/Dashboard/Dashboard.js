import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';


class Dashboard extends Component {
    state = {  }
    render() { 
        return ( 
            <div className='App'>
                <h1>Ecomentor</h1>
                <div className="animated fadeIn">
        <Row>
            <Card className="text-white bg-info">
              <CardHeader>
                <h3>Welcome!!</h3> 
              </CardHeader>
              <CardBody>
                <h4>
                 Please Select Options from the drawer: <br/>
                 1. Category: To add,update,delete the categories. 
                 2. Activity: To add,update,delete the activities.
                 3. Tip: To add,update,delete the Tips.
                 4. News: To add,update,delete the News.
                 5. User List: To check the User List.
                 6. Feedback List: To check Feedback List.
                 7. Daily Weekly Tip: To set Daily and Weekly Tip.
                 </h4>
              </CardBody>
            </Card>
          </Row>
          </div>
            </div>
         );
    }
}
 
export default Dashboard;