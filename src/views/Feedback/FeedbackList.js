import React, { Component } from 'react';
import {  Table } from 'reactstrap';

class FeedbackList extends Component {
  constructor(props)
  {
    super(props)
        this.state = {
          data:[],
          dataGetFeedback: [],        
  }
}

componentDidMount()
  {
        const headers =new Headers()
        headers.append('Content-Type', 'application/json');

        const options = {
          method: 'POST',
          headers,
          body: JSON.stringify({
            category_id: this.state.category_id,
            category_name: this.state.category_name,
          })
        }
        fetch('https://ecomentor.cloudjiffy.net/admin/getFeedbackList' , options)
          .then((Response) => Response.json())
          .then((findresponse)=>
          {
            console.log(findresponse.data)
            var testData= findresponse.data;
            console.log("testData",JSON.stringify(testData));
              this.setState({
                dataGetFeedback:findresponse.data,
              })
          })
  }

  _refreshUserList() {
    const headers =new Headers()
        headers.append('Content-Type', 'application/json');

        const options = {
          method: 'POST',
          headers,
        //   body: JSON.stringify({
        //     category_id: this.state.category_id,
        //     category_name: this.state.cate
        //   }) 
        }
    fetch('https://ecomentor.cloudjiffy.net/admin/getFeedbackList' , options)
    .then((Response) => Response.json())
    .then((findresponse)=>
    {
      console.log(findresponse.data)
        this.setState({
          dataGetFeedback:findresponse.data,
        })
    })
  }
  render() {
    let dataGetFeedback = this.state.dataGetFeedback.map((dataGetFeedback) => {
        return (
          <tr key={dataGetFeedback.fcm_id}>
            <td>{dataGetFeedback.fcm_id}</td>
            <td>{dataGetFeedback.suggestion_title}</td>
            <td>{dataGetFeedback.benefit_health}</td>
            <td>{dataGetFeedback.benefit_wealth}</td>
          </tr>
        )
    });
    return (
      <div>
      <div className="App container">
      <br />
      <Table>
         <thead>
           <tr>
              <th className="App">FCM ID</th>
             <th className="App">Suggestion Title</th>
             <th className="App">Health</th>
             <th className="App">Wealth</th>
           </tr>
          </thead>
        <tbody>
           {dataGetFeedback}
        </tbody>
      </Table>
    </div>
    </div>
    );  
  }
}

export default FeedbackList;