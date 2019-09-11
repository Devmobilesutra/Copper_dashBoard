import React, { Component } from 'react';
import axios from 'axios';
import { FormGroup, Label, Input,  Modal, ModalHeader, ModalBody, ModalFooter, Table, Button } from 'reactstrap';

class AddCategory extends Component {
  constructor(props)
  {
    super(props)
        this.state = {
          data:[],
          dataNews: [],
          dataSelectCat: [],

          addNewsError : '',
          addDescError: '',
          addCityError: '',
          addSourceError: '',
          selectCatError: '',
          addDateError: '',
           
          file: null,

          newNewsData: {
            title: '',
            news_image: '',
            news_description: '',
            city_name: '',
            news_from: '',
            category_name: '',
            date: '',
            category_id: '',
          },
          editNewsData: {
            news_id: '',
            title: '',
            news_image: '',
            news_description: '',
            city_name: '',
            news_from: '',
            category_name: '',
            date: '',
             
          },
      newNewsModal: false,
      editNewsModal: false,
  }
 // this.handleChange = this.handleChange.bind(this)
}

validate = () => {
   
  let addNewsError= '';
  let addDescError= '';
  let addCityError= '';
  let addSourceError= '';
  let selectCatError= '';
  let addDateError= '';

  if(!this.state.newNewsData.title)  {
    addNewsError = 'Title cannot be empty';
  }
  if(!this.state.newNewsData.news_description)  {
    addDescError = 'Description cannot be empty';
  }
  if(!this.state.newNewsData.city_name)  {
    addCityError = 'City Name cannot be empty';
  }
  if(!this.state.newNewsData.news_from)  {
    addSourceError = 'Source cannot be empty';
  }
  if(!this.state.newNewsData.category_name)  {
    selectCatError = 'Please Select Category';
  }
  if(!this.state.newNewsData.date)  {
    addDateError = 'Please Enter Date';
  }
    if(addNewsError || addDescError || addCityError || addSourceError || 
      selectCatError || addDateError){
      this.setState({addNewsError, addDescError, addCityError, addSourceError,
         selectCatError, addDateError});
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
            //category_id: this.state.category_id,
             
          })
        }
        fetch('https://ecomentor.cloudjiffy.net/admin/getNewsList' , options)
          .then((Response) => Response.json())
          .then((findresponse)=>
          {
            console.log(findresponse.data)
            var testData= findresponse.data;
            console.log("testData",JSON.stringify(testData));
              this.setState({
                dataNews:findresponse.data,
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
                dataSelectCat:findresponse.data,
              })
          })
  }

  // handleChange(event) {
  //   this.setState({
  //     file: URL.createObjectURL(event.target.files[0])
  //   })
  // }

  toggleNewNewsModal() {
   this.setState({
     newNewsModal: ! this.state.newNewsModal,

     addNewsError : '',
     addDescError: '',
     addCityError: '',
     addSourceError: '',
     selectCatError: '',
     addDateError: '',
   });
  }

  toggleEditNewsModal() {
    this.setState({
      editNewsModal: ! this.state.editNewsModal
    });
   }

  addNews() {

    const isValid = this.validate();

    if (isValid){
   
    const url = 'https://ecomentor.cloudjiffy.net/admin/addNews';
    

    let formData = new FormData();
    //Data.append('news_id', this.state.newNewsData.news_id);
    formData.append('title', this.state.newNewsData.title);
    formData.append('news_image', this.state.newNewsData.news_image);
    formData.append('news_description', this.state.newNewsData.news_description);
    formData.append('city_name', this.state.newNewsData.city_name);
    formData.append('news_from', this.state.newNewsData.news_from);
    formData.append('category_name',  this.state.newNewsData.category_name);
    formData.append('date', this.state.newNewsData.date);
    //formData.append('category_id', this.state.newNewsData.category_id);

    const config = {     
      headers: { 'content-type': 'multipart/form-data' }
     }

     axios.post(url, formData, config)
            .then(response => {
                console.log(response.data);
                this._refreshNews();
            })
            .catch(error => {
                console.log(error);
            });

            this.setState({ newNewsModal:false, newNewsData: {
              title: '', news_image: '',
              news_description: '',
              city_name: '',
              news_from: '',
              category_name: '',
              date: '',
              //category_id: '', 
             }});   
             //clear form
             //this.setState(initialState);
            }             //isValid             
  }

  update() {
     
    let { category_name } =this.state.editNewsData;
    console.log(category_name);
    const url = 'https://ecomentor.cloudjiffy.net/admin/updateNews';
    let formData = new FormData();
    formData.append('news_id', this.state.editNewsData.news_id);
    formData.append('title', this.state.editNewsData.title);
    formData.append('news_image', this.state.editNewsData.news_image);
    formData.append('news_description', this.state.editNewsData.news_description);
    formData.append('city_name', this.state.editNewsData.city_name);
    formData.append('news_from', this.state.editNewsData.news_from);
    formData.append('category_name',  this.state.editNewsData.category_name);
    formData.append('date', this.state.editNewsData.date);
   

    const config = {     
      headers: { 'content-type': 'multipart/form-data' }
     }

     axios.post(url , formData, config).then((response)  => {
    //}).then((response) => {
      this.setState({
        editNewsModal: false , editNewsData: { news_id:this.state.editNewsData.news_id , 
          title:this.state.editNewsData.title,
          news_image:this.state.editNewsData.news_image,
          news_description:this.state.editNewsData.news_description ,
          city_name:this.state.editNewsData.city_name ,
          news_from:this.state.editNewsData.news_from ,
          category_name:this.state.editNewsData.category_name ,
          date:this.state.editNewsData.date ,

        }  
      })
      this._refreshNews();
  });
  }

  editNews(news_id, title, news_image, news_description, city_name, news_from, category_name, 
    date) {
     this.setState({
       editNewsData: {news_id, title, news_image, news_description, city_name, news_from, category_name, 
        date},
        editNewsModal: ! this.state.editNewsModal
     });
  }

  deleteNews(news_id) {
    console.log(news_id);
    
    const url = 'https://ecomentor.cloudjiffy.net/admin/deleteNews';

    let formData = new FormData();
    console.log("news_id",JSON.stringify(news_id));
    let id = JSON.parse(news_id);
    //formData.append('category_id', "78");                        //Working

    formData.append('news_id', id);
    const config = {     
      headers: { 'content-type': 'multipart/form-data' }
     }
     axios.post(url, formData, config)
     .then((response) => {
        this._refreshNews();
      });
  }

  _refreshNews() {
    const headers =new Headers()
        headers.append('Content-Type', 'application/json');

        const options = {
          method: 'POST',
          headers,
          body: JSON.stringify({
            //category_id: this.state.category_id,
            //category_name: this.state.cate
          }) 
        }
    fetch('https://ecomentor.cloudjiffy.net/admin/getNewsList' , options)
    .then((Response) => Response.json())
    .then((findresponse)=>
    {
      console.log(findresponse.data)
        this.setState({
          dataNews:findresponse.data,
        })
    })
  }

  render() {
    let dataSelectCategory = this.state.dataSelectCat;
        let CategoryItems = dataSelectCategory.map((dataSelectCategory) =>
                <option key={dataSelectCategory.category_id} value={dataSelectCategory.category_name} >
                  {dataSelectCategory.category_name}</option>
            );

    let dataNews = this.state.dataNews.map((dataNews) => {
        return (
          <tr key={dataNews.news_id}>
            <td>{dataNews.news_id}</td>
            <td>{dataNews.category_name}</td>
            <td>{dataNews.title}</td>
            <td>{dataNews.news_description}</td>
            <td>{dataNews.city_name}</td>
            <td>{dataNews.news_from}</td>
            <td>{dataNews.date}</td>
            <td>{dataNews.news_image}</td>
            <td>
              <Button color="success" size="sm" className="mr-2" 
                onClick={this.editNews.bind(this, dataNews.news_id, dataNews.title, dataNews.news_image,
                dataNews.news_description, dataNews.city_name, dataNews.news_from, dataNews.category_name,
                dataNews.date )}>Edit</Button>
              
              <Button color="danger" size="sm" 
              onClick={this.deleteNews.bind(this, dataNews.news_id)}>Delete</Button>
            </td>
          </tr>
        )
    });
    return (
      
      <div >
      <br />
      <h3>To add New News Click Here:
        <Button classsname="my-3" color="primary" 
        onClick={this.toggleNewNewsModal.bind(this)}>Add News</Button>
         </h3>
        <br/>

        <div className="App container">
        <Modal isOpen={this.state.newNewsModal} toggle={this.toggleNewNewsModal.bind(this)} >
          <ModalHeader toggle={this.toggleNewNewsModal.bind(this)}>Add a new News</ModalHeader>
          <ModalBody> 
           {/* <FormGroup>
            <Label for="AddNews">Add News Image:</Label>
            <Input type="file" 
            // onChange={this.handleChange}
            value={this.state.newNewsData.news_image} onChange={(e) => {
              let { newNewsData } = this.state;
             // file: URL.createObjectURL(event.target.files[0])
              newNewsData.news_image = URL.createObjectURL(e.target.value);
              this.setState({ newNewsData });
          }} /> */}
            {/* <img src={this.state.file}/> */}
             {/* <img src={this.state.newNewsData.news_image}/> 
            </FormGroup> */}

          <FormGroup>
              <Label for="AddNews">Add News Title</Label>
              <Input id="newstitle" value={this.state.newNewsData.title} onChange={(e) => {
                  let { newNewsData } = this.state;
                  newNewsData.title = e.target.value;
                  this.setState({ newNewsData });
              }} />
              <div style={{ fontSize:12, color: "red" }}>{this.state.addNewsError}</div>
            </FormGroup>
            <FormGroup>
              <Label for="AddNews">Add News Description</Label>
              <Input id="newstitle" value={this.state.newNewsData.news_description} onChange={(e) => {
                  let { newNewsData } = this.state;
                  newNewsData.news_description = e.target.value;
                  this.setState({ newNewsData });
              }} />
              <div style={{ fontSize:12, color: "red" }}>{this.state.addDescError}</div>
            </FormGroup>
            <FormGroup>
              <Label for="AddNews">Add City Name</Label>
              <Input id="newstitle" value={this.state.newNewsData.city_name} onChange={(e) => {
                  let { newNewsData } = this.state;
                  newNewsData.city_name = e.target.value;
                  this.setState({ newNewsData });
              }} />
              <div style={{ fontSize:12, color: "red" }}>{this.state.addCityError}</div>
            </FormGroup>
            <FormGroup>
              <Label for="AddNews">Add News Source</Label>
              <Input id="newstitle" value={this.state.newNewsData.news_from} onChange={(e) => {
                  let { newNewsData } = this.state;
                  newNewsData.news_from = e.target.value;
                  this.setState({ newNewsData });
              }} />
              <div style={{ fontSize:12, color: "red" }}>{this.state.addSourceError}</div>
            </FormGroup>
            <FormGroup>
              <Label for="AddNews">Select Category</Label>
              <Input type="select"  id="categorySelect"  
                value={this.state.newNewsData.category_name}
                // value2={this.state.newNewsData.category_name}
                onChange={(e) => {
                  let { newNewsData } = this.state;
                  newNewsData.category_name = e.target.value;
                  console.log(e.target.value);
                  // newNewsData.category_name = e.target.value2;
                  // console.log(e.target.value2);
                  this.setState({ newNewsData });
                }}>
                  <option value = "0" >--SELECT--</option>
                  {CategoryItems}   
               </Input>
               <div style={{ fontSize:12, color: "red" }}>{this.state.selectCatError}</div>
            </FormGroup>
            <FormGroup>
              <Label for="AddNews">Add Date</Label>
              <Input type="date" id="newstitle" value={this.state.newNewsData.date} onChange={(e) => {
                  let { newNewsData } = this.state;
                  newNewsData.date = e.target.value;
                  this.setState({ newNewsData });
              }} />
              <div style={{ fontSize:12, color: "red" }}>{this.state.addDateError}</div>
            </FormGroup>

          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addNews.bind(this)}>Add News</Button> 
            <Button color="secondary" onClick={this.toggleNewNewsModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.editNewsModal} toggle={this.toggleEditNewsModal.bind(this)} >
          <ModalHeader toggle={this.toggleEditNewsModal.bind(this)}>Edit</ModalHeader>
          <ModalBody> 

            <FormGroup>
              <Label for="news">Update News Title</Label>
              <Input id="newstitleEdit" value={this.state.editNewsData.title} onChange={(e) => {
                  let { editNewsData } = this.state;
                  editNewsData.title = e.target.value;
                  this.setState({ editNewsData });
              }} />
            </FormGroup>
            <FormGroup>
              <Label for="news">Update News Description</Label>
              <Input id="newstitleEdit" value={this.state.editNewsData.news_description} onChange={(e) => {
                  let { editNewsData } = this.state;
                  editNewsData.news_description = e.target.value;
                  this.setState({ editNewsData });
              }} />
            </FormGroup>
          
            <FormGroup>
              <Label for="news">Update City Name</Label>
              <Input id="newstitle" value={this.state.editNewsData.city_name} onChange={(e) => {
                  let { editNewsData } = this.state;
                  editNewsData.city_name = e.target.value;
                  this.setState({ editNewsData });
              }} />
            </FormGroup>
            <FormGroup>
              <Label for="news">Update News Source</Label>
              <Input id="newstitle" value={this.state.editNewsData.news_from} onChange={(e) => {
                  let { editNewsData } = this.state;
                  editNewsData.news_from = e.target.value;
                  this.setState({ editNewsData });
              }} />
            </FormGroup>
            <FormGroup>
              <Label for="news">Update Category</Label>
              <Input type="select"  id="categorySelect"  
                value={this.state.editNewsData.category_name}
               // value2={this.state.editNewsData.category_name}
                onChange={(e) => {
                  let { editNewsData } = this.state;
                  editNewsData.category_name = e.target.value;
                  console.log(e.target.value);
                  // editNewsData.category_name = e.target.value2;
                  // console.log(e.target.value2);
                  this.setState({ editNewsData });
                }}>
                  <option value = "0" >--SELECT--</option>
                  {CategoryItems}   
               </Input>
            </FormGroup>
            <FormGroup>
              <Label for="news">Update Date</Label>
              <Input type="date" id="newstitle" value={this.state.editNewsData.date} onChange={(e) => {
                  let { editNewsData } = this.state;
                  editNewsData.date = e.target.value;
                  this.setState({ editNewsData });
              }} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.update.bind(this)}>Update </Button> 
            <Button color="secondary" onClick={this.toggleEditNewsModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>

      <Table>
         <thead>
           <tr>
              <th className="App">News ID</th>
              <th className="App">Category Name</th>
             <th className="App">News Title</th>
             <th className="App">News Description</th>
             <th className="App">City Name</th>
             <th className="App">News From</th>
             <th className="App">Date</th>
             <th className="App">Image</th>

             <th className="App">Actions</th>
           </tr>
          </thead>

        <tbody>
           {dataNews}
        </tbody>
      </Table>

      </div>
      </div>
    );
  }
}

export default AddCategory;