import React, { Component } from 'react';
import axios from 'axios';
import { FormGroup, Input, Button } from 'reactstrap';
import {Redirect} from 'react-router-dom';
import moment from 'moment';

class AddWeekly extends Component {
    constructor(props)
  {
    super(props)
        this.state = {
            dataByCatWeek: [],
            Daily_DateWeek: [],
            datadateWeek: [],
            tipsForWeekly: [],
            testDataWeekAlert: [],
            weekNr : '',
            WeekYear22: '',
            catDataWeek: {
              category_id: '',
              category_name: '',
              tip_id:'',
              title:'',
              date:'',
             },
             DailySelectErrorWeek: '',
             weeklyDateError: '',
            Category_id : this.props.location.state.category_id,
               redirect: false,
        }     
}

validate = () => {
  let DailySelectErrorWeek = '';
  let weeklyDateError = '';

  if(!this.state.catDataWeek.tip_id)  {
    DailySelectErrorWeek = 'Please Select a Tip';
  }

  if(!this.state.catDataWeek.date)  {
    weeklyDateError = 'Please Select The Date';
  }

    if(DailySelectErrorWeek || weeklyDateError ){
      this.setState({DailySelectErrorWeek , weeklyDateError});
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
        var dataByCatWeek= response.data.data;
        console.log("DataByCatWeek",JSON.stringify(dataByCatWeek));
        this.setState({
        dataByCatWeek: dataByCatWeek,
        })
       }).catch( (response) => {
      console.log(response);
     }); 
  }

  componentWillMount()
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
        var tipsForWeekly= response.data.data;
        console.log("tipsForWeekly",JSON.stringify(tipsForWeekly));
        this.setState({
        tipsForWeekly: tipsForWeekly,
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
//    fetch('https://ecomentor.cloudjiffy.net/admin/getTipDateNotNull' , options)
   fetch('https://ecomentor.cloudjiffy.net/admin/getTipDateNotNullWeek' , options) 
    .then((Response) => Response.json())
    .then((findresponse)=>
    {
     console.log(findresponse.data)
     var DateDataWeek= findresponse.data;
     console.log("DateDataWeek",JSON.stringify(DateDataWeek));
     for(var i=0;i<DateDataWeek.length;i++){
       var daily_dateWeek = DateDataWeek[i].weekly_date;
       console.log("daily_dateWeek--", daily_dateWeek);
       this.setState({
         Daily_DateWeek: DateDataWeek[i],
         })
     }
     this.setState({
     datadateWeek:findresponse.data,
     })
    })
  }

  


  Submit = (tip_id , date) => {

    //let weekYear = moment(date).week(date);
    //  var WeekYear222 = moment("2019-05-22", "YYYY-MM-DD").isoWeek();
    var WeekYear222 = moment(date).week();
    
    this.setState({
      WeekYear22: WeekYear222
    })

   // console.log('weekYear--------------',weekYear)
     console.log('WeekYear222=====',WeekYear222)
      
    
   
    const isValid = this.validate();
     if (isValid){
       console.log('Tip id:',tip_id)
       console.log('Weekly_date:',date)
       console.log('FORME:',this.state.datadateWeek)
       
      var dataWeek = this.state.datadateWeek
      console.log('dataWeek::::::',dataWeek)

      var weeklyDate = this.state.datadateWeek
      for(var i=0; i<weeklyDate.length; i++){
        var week_of_year =  weeklyDate[i].week_of_year;
        console.log("week_of_year--", week_of_year);
        if(week_of_year == WeekYear222)                                 
         {
            var flag = 1;
         }
        }
  
      for(var i=0;i<dataWeek.length;i++){
        var dateWeek = dataWeek[i].tip_id;
        console.log("dateWeek--", dateWeek);
        if(dateWeek == tip_id)
        {
            var flag = 2;
       }
      }

     
  
      if(flag == 1)
      {
        alert("You Already have set Tip For this Week")
        this.setState({redirect: false});
      
      }

      else if(flag == 2){
        alert("You Already have selected this tip")
        this.setState({redirect: false});
      }
      
      else{
       let formData = new FormData();
       formData.append('tip_id', tip_id);
       formData.append('weekly_date', date);    
       formData.append('week_of_year', WeekYear222);
      axios({
       method: 'post',
      //  url: 'http://localhost:8080/admin/updateWeeklyTip',
      url: ' https://ecomentor.cloudjiffy.net/admin/updateWeeklyTip', 
       data: formData,
       config: { headers: {'Content-Type': 'multipart/form-data' }}
       })
       .then(function (response) {
                   
       console.log(response);
        var testData2Week = response.data;
        console.log("testDataWeek--",JSON.stringify(testData2Week));
        }).catch(function (response) {
        console.log(response);
       });
          
      alert('You Have Succesfully Added Weekly Tip');  
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
       
   let TipByCatWeek = this.state.dataByCatWeek;
   let optionCatWeek = TipByCatWeek.map((TipByCatWeek) =>
   <option key={TipByCatWeek.tip_id} value={TipByCatWeek.tip_id}>
   {TipByCatWeek.title}</option>
   ); 
 return ( 
   <div  className="App">
    <h4>Select Weekly Tip:</h4>
   <FormGroup>
    <Input type="select" name="select" id="SelectTip" 
     value={this.state.catDataWeek.tip_id} onChange={(e) => {
      let { catDataWeek } = this.state;
      catDataWeek.tip_id = e.target.value;
      this.setState({ catDataWeek });
      console.log('catDataWeek', catDataWeek)
     }}>
     <option value = "0" >--SELECT--</option>
      {optionCatWeek}
     </Input>
     <div style={{ fontSize:12, color: "red" }}>{this.state.DailySelectErrorWeek}</div> 
    </FormGroup>

    <h4>Select Date For Which You Want to Set Tip:</h4>
    <FormGroup>
        <Input type="date" id="DailyDate" value={this.state.catDataWeek.date} onChange={(e) => {
                  let { catDataWeek } = this.state;
                  catDataWeek.date = e.target.value;
                  this.setState({ catDataWeek });
              }} />
              <div style={{ fontSize:12, color: "red" }}>{this.state.weeklyDateError}</div>
    </FormGroup>

    


    <Button color="danger" size="sm" 
        onClick={this.Submit.bind(this, this.state.catDataWeek.tip_id , this.state.catDataWeek.date)}>Submit</Button>
     </div>
      );
    }
}
 
export default AddWeekly;