import React, { Component } from 'react';
import axios from 'axios';
import { FormGroup, Label, Input,  Modal, ModalHeader, ModalBody, ModalFooter, Table, Button } from 'reactstrap';

class AddTip extends Component {
  constructor(props)
  {
    super(props)
        this.state = {
          dataTip:[],
         // name: '',
          //  check1: false,
          //  check2: false,

          selectCat:[],
          selectAct:[],
          
          
          addTipError: '',
          checkHWError: '',
          catSelectError: '',
          actSelectError: '',

          newTipData: {
            title:'',
            health:'',
            wealth:'',
            category_id:'',
            activity_id:'',
         },
         editTipData: {
            tip_id: '', 
            title: '',
            category_id: '',
            activity_id: '',
            health: '',
            wealth: '',
        },
      newTipModal: false,
      editTipModal: false,
  }
}

validate = () => {
  let addTipError = '';
  let checkHWError= '';
  let catSelectError = '';
  let actSelectError = '';

  if(!this.state.newTipData.title)  {
    addTipError = 'Category cannot be empty';
  }
  if(!this.state.newTipData.health && !this.state.newTipData.wealth )  {
    checkHWError = 'Please Select At Least One';
  }
  if(!this.state.newTipData.category_id)  {
    catSelectError = 'Please Select Category';
  }
  if(!this.state.newTipData.activity_id)  {
    actSelectError = 'Please Select Activity';
  }

    if(addTipError || catSelectError || actSelectError || checkHWError  ){
      this.setState({addTipError, catSelectError, actSelectError, checkHWError });
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
            tip_id: this.state.tip_id,
            title: this.state.title,
            activity_id: this.state.activity_id,
            category_id: this.state.category_id,
          })
          
        }

        fetch('https://ecomentor.cloudjiffy.net/admin/getTipList' , options)
          .then((Response) => Response.json())
          .then((findresponse)=>
          {
            console.log(findresponse.data)
            var testData= findresponse.data;
            console.log("testData",JSON.stringify(testData));
              this.setState({
                dataTip:findresponse.data,
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
                selectCat:findresponse.data,
              })
          })
   
        // const headers =new Headers()
        // headers.append('Content-Type', 'application/json');

        // const options = {
        //   method: 'POST',
        //   headers,
        //   body: JSON.stringify({
            
        //     activity_name: this.state.activity_name,
        //     activity_id: this.state.activity_id,
        //   })
          
        // }

        fetch('https://ecomentor.cloudjiffy.net/admin/getActivityList' , options)
          .then((Response) => Response.json())
          .then((findresponse)=>
          {
            console.log(findresponse.data)
            var testData= findresponse.data;
            console.log("testData",JSON.stringify(testData));
              this.setState({
                selectAct:findresponse.data,
              })
          })
  }
 

  toggleNewTipModal() {
   this.setState({
     newTipModal: ! this.state.newTipModal,

      addTipError: '',
      catSelectError: '',
      actSelectError: '',
      checkHWError: '',
   });
  }

  toggleEditTipModal() {
    this.setState({
      editTipModal: ! this.state.editTipModal
    });
   }

  addTip() {
    const isValid = this.validate();

    if (isValid){

    const url = 'https://ecomentor.cloudjiffy.net/admin/addTip';

    let formData = new FormData();
    console.log("health is ",this.state.newTipData.health);
    console.log("wealth is ",this.state.newTipData.wealth);
     formData.append('title', this.state.newTipData.title);

     if(this.state.newTipData.health === true){
      formData.append('health', "Yes");
      } 
      else{
        formData.append('health', "No");
      }

      if(this.state.newTipData.wealth === true){
        formData.append('wealth', "Yes");
        } 
      else{
          formData.append('wealth', "No");
        }
      
     formData.append('category_id', this.state.newTipData.category_id);
     formData.append('activity_id', this.state.newTipData.activity_id);
     formData.append('total_like_count', 0);
     formData.append('total_dislike_count', 0);
     formData.append('total_complete_count', 0);
   

    const config = {     
      headers: { 'content-type': 'multipart/form-data' }
     }

     axios.post(url, formData, config)
            .then(response => {
                console.log(response.data);
                this._refreshTip();
            })
            .catch(error => {
                console.log(error);
            });

            this.setState({ newTipModal:false, newTipData: {
              title: '',
              health: '',
              wealth: '',
              category_id: '',
              activity_id: '',
              
             }});   
             //clear form
             //this.setState(initialState);
            }             //isValid           
            
  }

  updateTip() {
     
    let { title } =this.state.editTipData;
    let { activity_id } =this.state.editTipData;
    let { category_id } =this.state.editTipData;
    let { health } =this.state.editTipData;
    let { wealth } =this.state.editTipData;
    console.log(title);
    console.log(activity_id);
    console.log(category_id);
    console.log(health);
    console.log(wealth);

    const url = 'https://ecomentor.cloudjiffy.net/admin/updateTip';
    let formData = new FormData();
    formData.append('tip_id', this.state.editTipData.tip_id);
    formData.append('title',this.state.editTipData.title);
    formData.append('activity_id', this.state.editTipData.activity_id);
    formData.append('category_id', this.state.editTipData.category_id);
    // formData.append('health',this.state.editTipData.health);
    // formData.append('wealth',this.state.editTipData.wealth);
    if(this.state.editTipData.health === true){
      formData.append('health', "Yes");
      } 
      else{
        formData.append('health', "No");
      }

      if(this.state.editTipData.wealth === true){
        formData.append('wealth', "Yes");
        } 
      else{
          formData.append('wealth', "No");
        }
   

    const config = {     
      headers: { 'content-type': 'multipart/form-data' }
     }


     axios.post(url , formData, config).then((response)  => {

    }).then((response) => {
      
      this.setState({
        editTipModal: false , editTipData: { tip_id:this.state.editTipData.tip_id , 
          title:this.state.editTipData.title,
          activity_id:this.state.editTipData.activity_id,
          category_id:this.state.editTipData.category_id,
          health:this.state.editTipData.health,
          wealth:this.state.editTipData.wealth,
        }  
      })
      this._refreshTip();
  });
  }

  editTip( tip_id, title, activity_id, category_id, health, wealth) {
     this.setState({
       editTipData: { tip_id, title, activity_id, category_id, health, wealth},
        editTipModal: ! this.state.editTipModal
     });
  }

  deleteTip(tip_id) {
    console.log(tip_id);
    
    const url = 'https://ecomentor.cloudjiffy.net/admin/deleteTip';

    let formData = new FormData();
    console.log("tip_id",JSON.stringify(tip_id));
    let id = JSON.parse(tip_id);
    //formData.append('category_id', "78");                        //Working

    formData.append('tip_id', id);
    const config = {     
      headers: { 'content-type': 'multipart/form-data' }
     }
     axios.post(url, formData, config)
     .then((response) => {
        this._refreshTip();
      });

  }

  _refreshTip() {
    const headers =new Headers()
        headers.append('Content-Type', 'application/json');

        const options = {
          method: 'POST',
          headers,
          body: JSON.stringify({
            tip_id: this.state.tip_id,
            title: this.state.title,
            activity_id: this.state.activity_id,
            category_id: this.state.category_id,
          }) 
        }
    fetch('https://ecomentor.cloudjiffy.net/admin/getTipList' , options)
    .then((Response) => Response.json())
    .then((findresponse)=>
    {
      console.log(findresponse.data)
        this.setState({
          dataTip:findresponse.data,
        })
    })
  }


  render() {
     
    let catSelect = this.state.selectCat;
        let optionCategory = catSelect.map((catSelect) =>
                <option key={catSelect.category_id} value={catSelect.category_id}>
                  {catSelect.category_name}</option>
            );


     let actSelect = this.state.selectAct;
        let optionActivity = actSelect.map((actSelect) =>
                  <option key={actSelect.activity_id} value={actSelect.activity_id}>
                      {actSelect.activity_name}</option>
                );

    let dataTip = this.state.dataTip.map((dataTip) => {
        return (
          <tr key={dataTip.tip_id}>
            <td>{dataTip.tip_id}</td>
            <td>{dataTip.activity_id}</td>
            <td>{dataTip.category_id}</td>
            <td>{dataTip.title}</td>
            <td>{dataTip.total_like_count}</td>
            <td>{dataTip.total_dislike_count}</td>
            <td>{dataTip.total_complete_count}</td>
            <td>
              <Button color="success" size="sm" className="mr-2" 
                onClick={this.editTip.bind(this, dataTip.tip_id, dataTip.title, dataTip.activity_id,
                dataTip.category_id, dataTip.health, dataTip.wealth)}>Edit</Button>
              
              <Button color="danger" size="sm" 
              onClick={this.deleteTip.bind(this, dataTip.tip_id)}>Delete</Button>
            </td>
          </tr>
        )
    });
    return (
      <div>
        <br />
        <h3>To add New Tip Click Here:
        <Button classsname="my-3" color="primary" 
        onClick={this.toggleNewTipModal.bind(this)}>Add Tip</Button>
         </h3>
        <br/>

        <div className="App container">
        <Modal isOpen={this.state.newTipModal} toggle={this.toggleNewTipModal.bind(this)} >
          <ModalHeader toggle={this.toggleNewTipModal.bind(this)}>Add a new Tip</ModalHeader>
          <ModalBody> 

            <FormGroup>
              <Label for="AddTip">Tip Title</Label>
              <Input id="addtip" value={this.state.newTipData.title} onChange={(e) => {
                  let { newTipData } = this.state;
                  newTipData.title = e.target.value;
                  this.setState({ newTipData });
              }} />
               <div style={{ fontSize:12, color: "red" }}>{this.state.addTipError}</div> 
               </FormGroup>

              <FormGroup>
              <Label for="AddTip">Select:</Label>
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               <input type="checkbox" name="check1"
                 checked={this.state.check1} 
                 //onChange={this.onCheckChange} /> Health 
                  value={this.state.checked} onChange={(e) => {
                      console.log(e.target.checked);
                       let { newTipData } = this.state;
                        newTipData.health = e.target.checked;
                        //console.log("valuueee is",e.target.checked);
                        this.setState({ newTipData });
                        //console.log("newhealth",newTipData);
                    }} /> Health    
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                <input type="checkbox" name="check2" 
                 checked={this.state.check2} 
                // onChange={this.onCheckChange}/> Wealth
                 value={this.state.checked} onChange={(e) => {
                  console.log(e.target.checked);
                  let { newTipData } = this.state;
                   newTipData.wealth = e.target.checked;
                   //console.log("valuueee is",e.target.checked);
                   this.setState({ newTipData });
                   //console.log("new",newTipData);
               }} /> Wealth   
                 <div style={{ fontSize:12, color: "red" }}>{this.state.checkHWError}</div> 
                </FormGroup>
                  
              <FormGroup> 
              <Label for="AddTip">Select Category</Label>
              <Input type="select" name="select" id="categorySelect" 
                value={this.state.newTipData.category_id} onChange={(e) => {
                  let { newTipData } = this.state;
                  newTipData.category_id = e.target.value;
                  this.setState({ newTipData });
                }}>

                  <option value = "0" >--SELECT--</option>
                  {optionCategory}
                   {/* <option value = "0" >--SELECT--</option>
                   <option value = "1" >Energy</option>
                   <option value = "2" >Water</option>
                   <option value = "3" >Air</option>
                   <option value = "4" >Waste</option>
                   <option value = "5" >Temperature</option>
                   <option value = "6" >Soil</option> */}
                </Input> 
                <div style={{ fontSize:12, color: "red" }}>{this.state.catSelectError}</div> 
                </FormGroup>

                <FormGroup>
               <Label for="AddTip">Select Activity</Label>
               <Input type="select" name="select" id="activitySelect" 
                value={this.state.newTipData.activity_id} onChange={(e) => {
                  let { newTipData } = this.state;
                  newTipData.activity_id = e.target.value;
                  this.setState({ newTipData });
                }}>

                <option value = "0" >--SELECT--</option>
                  {optionActivity}
                   {/* <option value = "0" >--S
                   
                   <option value = "1" >aaa</op
                   
                   <option value = "2" >Travell
                   
                   <option value = "3" >At Work
                   
                   <option value = "4" >At Home
                   
                   <option value = "5" >Purchasing/Shopping</option>
                   <option value = "6" >Cooking</option> */}
                </Input> 
                <div style={{ fontSize:12, color: "red" }}>{this.state.actSelectError}</div> 
              {/* <Input id="catid" value={this.state.newActData.category_id} onChange={(e) => {
                  let { newActData } = this.state;
                  newActData.category_id = e.target.value;
                  this.setState({ newActData });
              }} /> */}
            </FormGroup>

          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addTip.bind(this)}>Add Tip</Button> 
            <Button color="secondary" onClick={this.toggleNewTipModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.editTipModal} toggle={this.toggleEditTipModal.bind(this)} >
          <ModalHeader toggle={this.toggleEditTipModal.bind(this)}>Edit</ModalHeader>
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
              <Label for="tip">Update Tip Title</Label>
              <Input id="title" value={this.state.editTipData.title} onChange={(e) => {
                  let { editTipData } = this.state;
                  editTipData.title = e.target.value;
                  this.setState({ editTipData });
              }} />
            </FormGroup>

            <FormGroup>
            <Label for="EditTip">Update Select:</Label>
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               <input type="checkbox" name="check1"
                 checked={this.state.check1} 
                 //onChange={this.onCheckChange} /> Health 
                  value={this.state.checked} onChange={(e) => {
                      //console.log(e.target.checked);
                       let { editTipData } = this.state;
                        editTipData.health = e.target.checked;
                        //console.log("valuueee is",e.target.checked);
                        this.setState({ editTipData });
                        //console.log("newhealth",newTipData);
                    }} /> Health    
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                <input type="checkbox" name="check2" 
                 checked={this.state.check2} 
                // onChange={this.onCheckChange}/> Wealth
                 value={this.state.checked} onChange={(e) => {
                  //console.log(e.target.checked);
                  let { editTipData } = this.state;
                   editTipData.wealth = e.target.checked;
                   //console.log("valuueee is",e.target.checked);
                   this.setState({ editTipData });
                   //console.log("new",newTipData);
               }} /> Wealth     

            </FormGroup>

            <FormGroup>
            <Label for="EditTip">Update Select Category</Label>
              <Input type="select" name="select" id="categorySelect" 
                value={this.state.editTipData.category_id} onChange={(e) => {
                  let { editTipData } = this.state;
                  editTipData.category_id = e.target.value;
                  this.setState({ editTipData });
                }}>
                  <option value = "0" >--SELECT--</option>
                  {optionCategory}
                </Input> 
            </FormGroup>
            <FormGroup>
            <Label for="EditTip">Update Select Activity</Label>
               <Input type="select" name="select" id="activitySelect" 
                value={this.state.editTipData.activity_id} onChange={(e) => {
                  let { editTipData } = this.state;
                  editTipData.activity_id = e.target.value;
                  this.setState({ editTipData });
                }}>
                <option value = "0" >--SELECT--</option>
                  {optionActivity} 
                </Input> 
               
            </FormGroup>


          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updateTip.bind(this)}>Update </Button> 
            <Button color="secondary" onClick={this.toggleEditTipModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>

      <Table>
         <thead>
           <tr>
              <th className="App" >Tip Id</th>
              <th className="App" >Activity Id</th>
              <th className="App" >Category Id</th>
              <th  className="App">Tip Title</th>
              <th  className="App">Like Count</th>
              <th  className="App">Dislike Count</th>
              <th  className="App">Follow Count</th>
              <th className="App" >Actions</th>

           </tr>
          </thead>

        <tbody>
           {dataTip}
        </tbody>
      </Table>

      </div>
      </div>
    );

    
  }
}

export default AddTip;