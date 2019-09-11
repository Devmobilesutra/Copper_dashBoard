import React, { Component } from 'react';
 
 
import { Table } from 'reactstrap';

class UserList extends Component {
  constructor(props)
  {
    super(props)
        this.state = {
          data:[],
          dataGetUserList: [],
        
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
        fetch('https://ecomentor.cloudjiffy.net/admin/getUserList' , options)
          .then((Response) => Response.json())
          .then((findresponse)=>
          {
            console.log(findresponse.data)
            var testData= findresponse.data;
            console.log("testData",JSON.stringify(testData));
              this.setState({
                dataGetUserList:findresponse.data,
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
    fetch('https://ecomentor.cloudjiffy.net/admin/getUserList' , options)
    .then((Response) => Response.json())
    .then((findresponse)=>
    {
      console.log(findresponse.data)
        this.setState({
          dataGetUserList:findresponse.data,
        })
    })
  }
  
  render() {
    let dataGetUserList = this.state.dataGetUserList.map((dataGetUserList) => {
        return (
          <tr key={dataGetUserList.fcm_id}>
            <td>{dataGetUserList.fcm_id}</td>
            <td>{dataGetUserList.username}</td>
            <td>{dataGetUserList.email_id}</td>
            <td>{dataGetUserList.gender}</td>
            <td>{dataGetUserList.city}</td>
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
             <th className="App">User Name</th>
             <th className="App">Email ID</th>
             <th className="App">Gender</th>
             <th className="App">City</th>
           </tr>
          </thead>
        <tbody>
           {dataGetUserList}
        </tbody>
      </Table>
    </div>
    </div>
    );  
  }
}

export default UserList;