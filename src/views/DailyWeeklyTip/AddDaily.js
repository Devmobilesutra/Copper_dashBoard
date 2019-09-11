import React, { Component } from 'react';
import axios from 'axios';
import { FormGroup, Input, Button } from 'reactstrap';
import {Redirect} from 'react-router-dom';

class AddDaily extends Component {
    constructor(props)
  {
    super(props)
        this.state = {
            dataByCat: [],
            Daily_Date: [],
            datadate: [],
            tips: [],
            catData:{
              category_id: '',
              category_name: '',
              date: '',
              tip_id:'',
              title:'',
             },
             DailySelectError: '',
             dailyDateError: '',
            Category_id : this.props.location.state.category_id ,
               redirect: false,
        }       
}

validate = () => {
  let DailySelectError = '';
  let dailyDateError= '';

  if(!this.state.catData.tip_id)  {
    DailySelectError = 'Please Select a Tip';
  }
  if(!this.state.catData.date)  {
    dailyDateError = 'Please Select The Date';
  }

    if(DailySelectError || dailyDateError ){
      this.setState({DailySelectError, dailyDateError});
      return false;
  }
return true;
}


componentDidMount = ()=>
{
    console.log('this.props.location.state.category_id',this.props.location.state.category_id);
    console.log('category id is',this.state.Category_id);

    let formData = new FormData();
     formData.append('category_id',this.props.location.state.category_id);
    axios({
     method: 'post',
     url: 'https://ecomentor.cloudjiffy.net/admin/getTipListbyCategory',
     data: formData,
     config: { headers: {'Content-Type': 'multipart/form-data' }}
     })
     .then( (response) => {
        console.log(response.data)
        var DataByCat= response.data.data;
        console.log("DataByCat",JSON.stringify(DataByCat));
        this.setState({
        dataByCat: DataByCat,
        })
       }).catch( (response) => {
      console.log(response);
     }); 
  }
 
  componentWillMount = ()=>
{
    console.log('this.props.location.state.category_id',this.props.location.state.category_id);
    console.log('category id is',this.state.Category_id);

    let formData = new FormData();
     formData.append('category_id',this.props.location.state.category_id);
    axios({
     method: 'post',
     url: 'https://ecomentor.cloudjiffy.net/admin/getTipList',
     data: formData,
     config: { headers: {'Content-Type': 'multipart/form-data' }}
     })
     .then( (response) => {
        console.log(response.data)
        var tips= response.data.data;
        console.log("tips",JSON.stringify(tips));
        this.setState({
        tips: tips,
        })
       }).catch( (response) => {
      console.log(response);
     }); 
  
   const headers =new Headers()
   headers.append('Content-Type', 'application/json');
   
   const options = {
    method: 'POST',
    headers,
    body: JSON.stringify({
     
    })
     }
   fetch('https://ecomentor.cloudjiffy.net/admin/getTipDateNotNull' , options)
    .then((Response) => Response.json())
    .then((findresponse)=>
    {
     console.log(findresponse.data)
     var DateData= findresponse.data;
     console.log("DateData",JSON.stringify(DateData));
     for(var i=0;i<DateData.length;i++){
       var daily_date = DateData[i].daily_date;
       console.log("daily_date--", daily_date);
       this.setState({
         Daily_Date: DateData[i],
         })
     }
     this.setState({
     datadate:findresponse.data,
     })
    })
  }


  Submit = (tip_id , date)  => {
    const isValid = this.validate();
     if (isValid){
       console.log('Tip id:',tip_id)
       console.log('date',date)
       console.log('FORME:',this.state.datadate)
      var data = this.state.datadate
      console.log('data::::::',data)
  
      for(var i=0;i<data.length;i++){
        var tip = data[i].tip_id;
        console.log("tip--", tip);
        if(tip == tip_id)
        {
            var flag = 1;
       }
      }

      var checkDate = this.state.tips
      for(var i=0;i<checkDate.length;i++){
        var daily_d = checkDate[i].daily_date;
        console.log("daily_d--", daily_d);
        if(daily_d == date)
        {
            var flag = 2;
       }
      }

      if(flag == 1)
      {
        alert("You Already have selected this tip")
      }

      else if(flag == 2){
        alert("You Already have set Tip For this Date")
      }
      
      else{
       let formData = new FormData();
       formData.append('tip_id', tip_id);
       formData.append('daily_date', date);
      axios({
       method: 'post',
      //  url: 'http://localhost:8080/admin/updateWeeklyTip',
      //http://localhost:8080/admin/updateDailyTip
      url: 'https://ecomentor.cloudjiffy.net/admin/updateDailyTip',
       data: formData,
       config: { headers: {'Content-Type': 'multipart/form-data' }}
       })
       .then(function (response) {
                   
       console.log(response);
        var testData2 = response.data;
        console.log("testData--",JSON.stringify(testData2));
        }).catch(function (response) {
        console.log(response);
       });
          
      alert('You Have Succesfully Added Daily Tip');  
      this.setState({redirect: true});
    }
      
      //clear form         
       //this.setState(initialState);
      
       }             //isValid   
     
   }

render() { 

  if (this.state.redirect) {
    return (<Redirect to={'/dailyWeeklyTip'}/>)
  }
       
   let TipByCat = this.state.dataByCat;
   let optionCat = TipByCat.map((TipByCat) =>
   <option key={TipByCat.tip_id} value={TipByCat.tip_id}>
   {TipByCat.title}</option>
   ); 
 return ( 
   <div className="App">
     <h4>Select Daily Tip:</h4>
   <FormGroup>
    <Input type="select" name="select" id="SelectTip" 
     value={this.state.catData.tip_id} onChange={(e) => {
      let { catData } = this.state;
      catData.tip_id = e.target.value;
      this.setState({ catData });
      console.log('catData', catData)
     }}>
     <option value = "0" >--SELECT--</option>
      {optionCat}
     </Input>
     <div style={{ fontSize:12, color: "red" }}>{this.state.DailySelectError}</div> 
    </FormGroup>

    <h4>Select Date For Which You Want to Set Tip:</h4>
    <FormGroup>
        <Input type="date" id="DailyDate" value={this.state.catData.date} onChange={(e) => {
                  let { catData } = this.state;
                  catData.date = e.target.value;
                  this.setState({ catData });
              }} />
              <div style={{ fontSize:12, color: "red" }}>{this.state.dailyDateError}</div>
            </FormGroup>


    <Button color="danger" size="sm" 
        onClick={this.Submit.bind(this, this.state.catData.tip_id , this.state.catData.date)}>Submit</Button>
     </div>
      );
    }
}
 
export default AddDaily;