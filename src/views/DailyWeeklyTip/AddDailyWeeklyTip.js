import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
 
import { Table, Button } from 'reactstrap';


class AddDailyWeeklyTip extends Component {
    constructor(props)
    {
      super(props)
          this.state = {
            Categorydata: [],
            
            category_id_npage: '',
            category_id_npage2: '',
            redirect: false,
            redirect2: false,   
    }
  }
  
componentWillMount()
{
    const headers =new Headers()
    headers.append('Content-Type', 'application/json');
  
    const options = {
        method: 'POST',
        headers,
        body: JSON.stringify({
            }) 
          }
        fetch('https://ecomentor.cloudjiffy.net/admin/getCategoryList' , options)
         .then((Response) => Response.json())
         .then((findresponse)=>
        {
            console.log(findresponse.data)
            var CategoryData= findresponse.data;
            console.log("CategoryData",JSON.stringify(CategoryData));
            this.setState({
            Categorydata:findresponse.data,
            })
        })
}

AddDaily = (category_id) =>  {
    console.log('category_id',category_id)
    this.setState({redirect: true ,category_id: category_id});
    console.log ('category_id_npage:',this.state.category_id)
  }

 AddWeekly(category_id){
  console.log('category_id',category_id)
  this.setState({redirect2: true ,category_id: category_id});
  console.log ('category_id_npage2:',this.state.category_id)
  
 }

render() { 
 
    if (this.state.redirect) {
      return ( <Redirect to={{
            pathname: '/AddDaily',
            // category_id_npage: this.state.category_id_npage
            state: { category_id: this.state.category_id }
        }}
        />)
      }

      if (this.state.redirect2) {
        return ( <Redirect to={{
          pathname: '/AddWeekly',
          // category_id_npage: this.state.category_id_npage
          state: { category_id: this.state.category_id }
      }}
      />)
      }

let Categorydata = this.state.Categorydata.map((Categorydata) => {
    return (
        
            <tr className="App" key={Categorydata.category_id}>
            <td className="App">{Categorydata.category_id}</td>
            <td className="App">{Categorydata.category_name}</td>
             <td className="App">
             <Button className="mr-2"  color="primary" size="sm"
                onClick={this.AddDaily.bind(this, Categorydata.category_id)}>Daily Tip</Button>
              
             <Button classsname="mr-2" color="primary" size="sm"
                onClick={this.AddWeekly.bind(this, Categorydata.category_id)}>Weekly Tip</Button>
            </td>
            </tr>
            
        )
     });

return ( 
    <div  className="App container">
    <h4>Click on Daily Tip or Weekly Tip Button of Category for which you want to select Daily or Weekly Tip :</h4>
    <br/>

    <Table>
    <thead>
     <tr>
        <th className="App">Category Id</th>
        <th className="App">Category Name</th>
        <th className="App">Actions</th>
     </tr>
    </thead>

    <tbody>
     {Categorydata}
    </tbody>
    </Table>
     

  </div>
  
         );
    }
}
 
export default AddDailyWeeklyTip;