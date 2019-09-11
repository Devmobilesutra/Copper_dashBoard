import React, { Component } from 'react';
 
import axios from 'axios';
import { FormGroup, Label, Input,  Modal, ModalHeader, ModalBody, ModalFooter, Table, Button } from 'reactstrap';

class AddCategory extends Component {
  constructor(props)
  {
    super(props)
        this.state = {
          data:[],
          addcat: '',
          addCatError: '',
          
          newData: {
          category_name: '',
          },
          editData: {
          category_id: '', 
          category_name: '',
          },
      newModal: false,
      editModal: false,
  }
}

validate = () => {
  let addCatError = '';

  if(!this.state.newData.category_name)  {
    addCatError = 'Category cannot be empty';
  }

    if(addCatError  ){
      this.setState({addCatError });
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
            category_id: this.state.category_id,
            category_name: this.state.category_name,
          })
        }
        //http://ecomentor.cloudjiffy.net/getMasterList
        fetch('https://ecomentor.cloudjiffy.net/admin/getCategoryList' , options)
          .then((Response) => Response.json())
          .then((findresponse)=>
          {
            console.log(findresponse.data)
            var testData= findresponse.data;
            console.log("testData",JSON.stringify(testData));
              this.setState({
                data:findresponse.data,
              })
          })
  }

  toggleNewModal() {
   this.setState({
     newModal: ! this.state.newModal,

     addCatError: '',
   });
  }

  toggleEditModal() {
    this.setState({
      editModal: ! this.state.editModal
    });
   }

  addCategory() {
    const isValid = this.validate();

    if (isValid){

    const url = 'https://ecomentor.cloudjiffy.net/admin/addCategory';

    let formData = new FormData();
    formData.append('category_name', this.state.newData.category_name);

    const config = {     
      headers: { 'content-type': 'multipart/form-data' }
     }

     axios.post(url, formData, config)
            .then(response => {
                console.log(response.data);
                this._refreshCategoury();
            })
            .catch(error => {
                console.log(error);
            });

            this.setState({ newModal:false, newData: {
              category_name: '',
             }}); 

              //clear form
             //this.setState(initialState);
            }             //isValid     
  }

  update() {
     
    let { category_name } =this.state.editData;

    console.log(category_name);
    const url = 'https://ecomentor.cloudjiffy.net/admin/updateCategory';
    let formData = new FormData();
    formData.append('category_name',this.state.editData.category_name);
    formData.append('category_id', this.state.editData.category_id);

    const config = {     
      headers: { 'content-type': 'multipart/form-data' }
     }


     axios.post(url , formData, config).then((response)  => {

    }).then((response) => {
      
      this.setState({
        editModal: false , editData: { category_id:this.state.editData.category_id , 
          category_name:this.state.editData.category_name}  
      })
      this._refreshCategoury();
  });
  }

  edit(category_id, category_name) {
     this.setState({
       editData: {category_id, category_name },
        editModal: ! this.state.editModal
     });
  }

  delete(category_id) {
    console.log(category_id);
    
    const url = 'https://ecomentor.cloudjiffy.net/admin/deleteCategory';

    let formData = new FormData();
    console.log("category_id",JSON.stringify(category_id));
    let id = JSON.parse(category_id);
    //formData.append('category_id', "78");                        //Working

    formData.append('category_id', id);
    const config = {     
      headers: { 'content-type': 'multipart/form-data' }
     }
     axios.post(url, formData, config)
     .then((response) => {
        this._refreshCategoury();
      });

  }

  _refreshCategoury() {
    const headers =new Headers()
        headers.append('Content-Type', 'application/json');

        const options = {
          method: 'POST',
          headers,
          body: JSON.stringify({
            category_id: this.state.category_id,
            category_name: this.state.cate
          }) 
        }
    fetch('https://ecomentor.cloudjiffy.net/admin/getCategoryList' , options)
    .then((Response) => Response.json())
    .then((findresponse)=>
    {
      console.log(findresponse.data)
        this.setState({
          data:findresponse.data,
        })
    })
  }

  render() {
    let data = this.state.data.map((data) => {
        return (
          <tr key={data.category_id}>
            <td>{data.category_id}</td>
            <td>{data.category_name}</td>
           
            <td>
              <Button color="success" size="sm" className="mr-2" 
                onClick={this.edit.bind(this, data.category_id, data.category_name)}>Edit</Button>
              
              <Button color="danger" size="sm" 
              onClick={this.delete.bind(this, data.category_id)}>Delete</Button>
            </td>
          </tr>
        )
    });
    return (
      <div>
      <br />
      <h3>To add New Category Click Here:
        <Button classsname="my-3" color="primary" 
          onClick={this.toggleNewModal.bind(this)}>Add Category</Button>
      </h3>
      <br/>
      <div className="App container">
        <Modal isOpen={this.state.newModal} toggle={this.toggleNewModal.bind(this)} >
          <ModalHeader toggle={this.toggleNewModal.bind(this)}>Add a new Category</ModalHeader>
          <ModalBody> 

            <FormGroup>
              <Label for="AddCategory">Add Category Name</Label>
              <Input id="title" value={this.state.newData.category_name} onChange={(e) => {
                  let { newData } = this.state;
                  newData.category_name = e.target.value;
                  this.setState({ newData });
              }} />
              <div style={{ fontSize:12, color: "red" }}>{this.state.addCatError}</div> 
            </FormGroup>

          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addCategory.bind(this)}>Add Category</Button> 
            <Button color="secondary" onClick={this.toggleNewModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.editModal} toggle={this.toggleEditModal.bind(this)} >
          <ModalHeader toggle={this.toggleEditModal.bind(this)}>Edit</ModalHeader>
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
              <Label for="category">Update Category</Label>
              <Input id="title" value={this.state.editData.category_name} onChange={(e) => {
                  let { editData } = this.state;
                  editData.category_name = e.target.value;
                  this.setState({ editData });
              }} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.update.bind(this)}>Update </Button> 
            <Button color="secondary" onClick={this.toggleEditModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>

      <Table>
         <thead>
           <tr>
              <th className="App">#</th>
             <th className="App">Category Name</th>
             <th className="App">Actions</th>
           </tr>
          </thead>

        <tbody>
           {data}
        </tbody>
      </Table>
        </div>
      </div>
       
      );

    
  }
}

export default AddCategory;