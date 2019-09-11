import React, { Component } from 'react';
 
import axios from 'axios';
import { FormGroup, Label, Input,  Modal, ModalHeader, ModalBody, ModalFooter, Table, Button } from 'reactstrap';

class AddActivity extends Component {
  constructor(props)
  {
    super(props)
        this.state = {
          dataAct:[],
          dataCheck: [],
          addActError: '',
          selectCatError: '',

          newActData: {
          activity_name: '',
          category_id: '',
         },
         editActData: {
          activity_id: '', 
          category_id: '',
         activity_name: '',
      
        },
      newActModal: false,
      editActModal: false,
  }
}

validate = () => {
  let addActError = '';
  let selectCatError = '';

  if(!this.state.newActData.activity_name)  {
    addActError = 'Activity cannot be empty';
  }
  if(!this.state.newActData.category_id)  {
    selectCatError = 'Please Select Category';
  }
  
    if(addActError || selectCatError ){
      this.setState({addActError , selectCatError });
      return false;
  }
return true;
}


componentDidMount()
  {
        const headers =new Headers()
        headers.append('Content-Type', 'application/json');

        const options = {
          method: 'POST',
          headers,
          body: JSON.stringify({
            activity_id: this.state.activity_id,
            activity_name: this.state.activity_name,
            category_id: this.state.category_id,
          })
          
        }

        fetch('https://ecomentor.cloudjiffy.net/admin/getActivityList' , options)
          .then((Response) => Response.json())
          .then((findresponse)=>
          {
            console.log(findresponse.data)
            var testData= findresponse.data;
            console.log("testData",JSON.stringify(testData));
              this.setState({
                dataAct:findresponse.data,
              })  
          })
  }
 
  componentWillMount()
  {
        const headers =new Headers()
        headers.append('Content-Type', 'application/json');

        const options = {
          method: 'POST',
          headers,
          body: JSON.stringify({
            
            category_name: this.state.category_name,
            category_id: this.state.category_id,
          }) 
        }
        fetch('https://ecomentor.cloudjiffy.net/admin/getCategoryList' , options)
          .then((Response) => Response.json())
          .then((findresponse)=>
          {
            console.log(findresponse.data)
            var testData= findresponse.data;
            console.log("testData",JSON.stringify(testData));
              this.setState({
                dataCheck:findresponse.data,
              })
          })
  }

  toggleNewActModal() {
   this.setState({
     newActModal: ! this.state.newActModal,

     addActError: '',
     selectCatError: '',
   });
  }

  toggleEditActModal() {
    this.setState({
      editActModal: ! this.state.editActModal
    });
   }

  addActivity() {
    const isValid = this.validate();

    if (isValid){
    const url = 'https://ecomentor.cloudjiffy.net/admin/addActivity';

    let formData = new FormData();
    formData.append('activity_name', this.state.newActData.activity_name);
    formData.append('category_id', this.state.newActData.category_id);

    const config = {     
      headers: { 'content-type': 'multipart/form-data' }
     }

     axios.post(url, formData, config)
            .then(response => {
                console.log(response.data);
                this._refreshActivity();
            })
            .catch(error => {
                console.log(error);
            });

            this.setState({ newActModal:false, newActData: {
              activity_name: '',
              category_id: '',
             }}); 
             //clear form
             //this.setState(initialState);
            }             //isValid             
  }

  updateAct() {
     
    let { activity_name } =this.state.editActData;

    console.log(activity_name);
    const url = 'https://ecomentor.cloudjiffy.net/admin/updateActivity';
    let formData = new FormData();
    formData.append('activity_id', this.state.editActData.activity_id);
    formData.append('category_id', this.state.editActData.category_id);
    formData.append('activity_name',this.state.editActData.activity_name);
    

    const config = {     
      headers: { 'content-type': 'multipart/form-data' }
     }


     axios.post(url , formData, config).then((response)  => {

    }).then((response) => {
      
      this.setState({
        editActModal: false , editActData: { activity_id:this.state.editActData.activity_id , 
         category_id:this.state.editActData.category_id , 
         activity_name:this.state.editActData.activity_name}  
      })
      this._refreshActivity();
  });
  }

  editAct( activity_id,category_id, activity_name) {
     this.setState({
       editActData: { activity_id, category_id, activity_name },
        editActModal: ! this.state.editActModal
     });
  }

  deleteAct(activity_id) {
    console.log(activity_id);
    
    const url = 'https://ecomentor.cloudjiffy.net/admin/deleteActivity';

    let formData = new FormData();
    console.log("activity_id",JSON.stringify(activity_id));
    let id = JSON.parse(activity_id);
    //formData.append('category_id', "78");                        //Working

    formData.append('activity_id', id);
    const config = {     
      headers: { 'content-type': 'multipart/form-data' }
     }
     axios.post(url, formData, config)
     .then((response) => {
        this._refreshActivity();
      });

  }

  _refreshActivity() {
    const headers =new Headers()
        headers.append('Content-Type', 'application/json');

        const options = {
          method: 'POST',
          headers,
          body: JSON.stringify({
            activity_id: this.state.activity_id,
            category_id: this.state.category_id,
            activity_name: this.state.activity_name
          }) 
        }
    fetch('https://ecomentor.cloudjiffy.net/admin/getActivityList' , options)
    .then((Response) => Response.json())
    .then((findresponse)=>
    {
      console.log(findresponse.data)
        this.setState({
          dataAct:findresponse.data,
        })
    })
  }


  render() {

    let dataChe = this.state.dataCheck;
        let optionItems = dataChe.map((dataChe) =>
                <option key={dataChe.category_id} value={dataChe.category_id}>
                  {dataChe.category_name}</option>
            );

    let dataAct = this.state.dataAct.map((dataAct) => {
        return (
         
          <tr key={dataAct.activity_id}>
            <td>{dataAct.activity_id}</td>
            <td>{dataAct.category_id}</td>
            <td>{dataAct.activity_name}</td>
      
            <td>
              <Button color="success" size="sm" className="mr-2" 
                onClick={this.editAct.bind(this, dataAct.activity_id, dataAct.category_id,dataAct.activity_name)}>Edit</Button>
              
              <Button color="danger" size="sm" 
              onClick={this.deleteAct.bind(this, dataAct.activity_id)}>Delete</Button>
            </td>
          </tr>
          
        )
    });
    return (
      <div>
        <br />
        <h3>To New add Activity Click Here:
        <Button classsname="my-3" color="primary" 
        onClick={this.toggleNewActModal.bind(this)}>Add Activity</Button>
         </h3>
        <br/>

      <div className="App container">
        <Modal isOpen={this.state.newActModal} toggle={this.toggleNewActModal.bind(this)} >
          <ModalHeader toggle={this.toggleNewActModal.bind(this)}>Add a new Activity</ModalHeader>
          <ModalBody> 

            <FormGroup>
              <Label for="AddActivity">Activity Name</Label>
              <Input id="actname" value={this.state.newActData.activity_name} onChange={(e) => {
                  let { newActData } = this.state;
                  newActData.activity_name = e.target.value;
                  this.setState({ newActData });
              }} />
              <div style={{ fontSize:12, color: "red" }}>{this.state.addActError}</div> 
              </FormGroup>

              <FormGroup>
              <Label for="AddActivity">Select Category</Label>
              <Input type="select" name="select" id="categorySelect" 
                value={this.state.newActData.category_id} onChange={(e) => {
                  let { newActData } = this.state;
                  newActData.category_id = e.target.value;
                  this.setState({ newActData });
                }}>
                  <option value = "0" >--SELECT--</option>
                  {optionItems}

                   {/* <option value = "0" >--SELECT--</option>
                   <option value = "1" >Energy</option>
                   <option value = "2" >Water</option>
                   <option value = "3" >Air</option>
                   <option value = "4" >Waste</option>
                   <option value = "5" >Temperature</option>
                   <option value = "6" >Soil</option> */}
               </Input>
               <div style={{ fontSize:12, color: "red" }}>{this.state.selectCatError}</div> 
              {/* <Input id="catid" value={this.state.newActData.category_id} onChange={(e) => {
                  let { newActData } = this.state;
                  newActData.category_id = e.target.value;
                  this.setState({ newActData });
              }} /> */}
            </FormGroup>

          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addActivity.bind(this)}>Add Activity</Button> 
            <Button color="secondary" onClick={this.toggleNewActModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.editActModal} toggle={this.toggleEditActModal.bind(this)} >
          <ModalHeader toggle={this.toggleEditActModal.bind(this)}>Edit</ModalHeader>
          <ModalBody> 

         { /* <FormGroup>
              <Label for="id">id</Label>
              <Input id="id" value={this.state.editData.category_id} onChange = {(e) => {
                 let { editData } = this.state;
                 editData.category_id = e.target.value;
                 this.setState({ editData });
              }} />
            </FormGroup>  
            */}

            <FormGroup>
              <Label for="activity">Update Activity</Label>
              <Input id="title" value={this.state.editActData.activity_name} onChange={(e) => {
                  let { editActData } = this.state;
                  editActData.activity_name = e.target.value;
                  this.setState({ editActData });
              }} />
            </FormGroup>

          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updateAct.bind(this)}>Update </Button> 
            <Button color="secondary" onClick={this.toggleEditActModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>
          
      <Table>
         <thead>
           <tr>
              <th className="App">Activity Id</th>
              <th className="App">Category Id</th>
             <th className="App">Activity Name</th>
             <th className="App">Actions</th>
           </tr>
          </thead>

        <tbody>
           {dataAct}
        </tbody>
      </Table>
      </div>  
    </div>
    );

    
  }
}

export default AddActivity;