import React, { Component } from 'react';
import { FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, Progress } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import Loader from "react-loader-spinner";
import Swal from 'sweetalert2';
import firebase from 'firebase';
// const probe = require('probe-image-size');
firebase.storage().ref();
const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total ml-2">
        Showing {from} to {to} of {size} Results
    </span>
);

export default class CategoryImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productsList: [],
            url: '',
            url1:'',
            file: '',
            img1:'',
            isLoading: false,

            //Add Images
            percentUploaded: null,

            ProgressBar: false,
           
            storageRef: firebase.storage().ref(),
      
            uploadTask: null,
          
            //Add Product data
            Add_productData: {
               Category_Name:'',
                Image_Name1: '',
              
            },
          
            addModal: false,

            columns: [
                
              
                {
                    dataField: 'img_url',
                    text: 'Images',
                    align: 'center',
                    formatter: this.Img_Nm1,
                    headerStyle: () => {
                        
                        // return {textAlign: 'center' };
                    },
                },
              
                {
                    dataField: 'Category_Name',
                    text: 'Category Name',
                    align: 'center',
                    headerStyle: () => {
                        return { 'width':'200px',textAlign: 'center' };
                    },
                },
                // {
                //     dataField: "Actions",
                //     text: "Actions",
                //      formatter: this.actionEditDeleteProduct,
                //     align: 'center',
                //     headerStyle: () => {
                //         return {'width':'200px',textAlign: 'center'};
                //     },
                // }
            ]
        };
    }
    Img_Nm1 = (cell, row) => {
        return (
            <span style={{ display:'block', width:'400px',height:'200px',overflow: 'hidden' }}>
                {/* {row.Image_Name1} */}
                <img src={row.img_url} alt={row.img_url} />
            </span>
        )
    }

    componentDidMount() {
        console.log("ComponentDidMount");
        firebase.firestore().collection('Category').onSnapshot(data => {
            // console.log("cmpnentdid",data.size)

            let Changes = data.docChanges();
            Changes.forEach((change) => {
                if (change.type === 'added') {
                    console.log("doc changes ", change.type, change.doc.id, change.doc.data());
                    // const product = this.state.productsList
                    // product.concat({ id: change.doc.id, ...change.doc.data() })
                    this.state.productsList.push({ id: change.doc.id, ...change.doc.data() })
                    console.log("added product", this.state.productsList);
                    // var str = "firebasestorage.googleapis.com/v0/b/copper…=media&token=632d2861-ed21-4fa5-9c69-bdda54b0aac8";
                    // console.log("String in htttps: form ", );
                }
                if (change.type === 'modified') {
                    console.log("doc changes modified", change.type, change.doc.data(), "ID", change.doc.id);
                    const newArray = this.state.productsList.map(e => {
                        if (e.id == change.doc.id) { console.log("value", e); return { id: change.doc.id, ...change.doc.data() } }
                        else return e
                    });
                    this.setState({ productsList: newArray }, () => console.log("state array", this.state.productsList))
                }
                if (change.type === 'removed') {
                    console.log("doc changes removed", change.type);

                    const eleRemovedArray = this.state.productsList.filter((e) =>
                        e.id !== change.doc.id
                    )
                    this.setState({ productsList: eleRemovedArray })
                }
            })
            this.setState({})
        })
    }

    // actionEditDeleteProduct = (cell, row) => {
    //     return (
    //         <div>
              
    //             &nbsp;&nbsp;
    //             <Button color="danger" size="md" className="mr-2"
    //                 onClick={() => { this.DeleteProduct(row.Category_Name) }}>
    //                 Delete
    //             </Button>
    //         </div>
    //     );
    // }

   
    AddModal() {
        let { addModal } = this.state;
        this.setState({url1:''})
        this.setState({ addModal: !addModal });
    }
   

   
    async Add_productData() {
        var len=this.state.productsList.length
        console.log(len,'length')
     
        const { Add_productData } = this.state;
        console.log()
        if (!Add_productData.Category_Name) {
            alert('please select category name');
            this.setState({ isLoading: false });
            return
        }
        else if (!Add_productData.Image_Name1) {
            alert('Please select Image');
            this.setState({ isLoading: false });
            return
        }
        
         this.setState({});
         firebase.firestore().collection('Category').doc(this.state.Add_productData.Category_Name)
           .update({
            img_url:this.state.Add_productData.Image_Name1,
           
           })
          .then(() => {
            Swal.fire({
                icon: 'success',
                text: "Image Added Succesfully",
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
        })
            .catch(error => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    text: "Something went wrong",
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'OK'
                })
            });
       
            
        Add_productData.Image_Name1 = ''
     
        this.setState({
            isLoading: false,
            addModal: !this.state.addModal,
            Add_productData
        })

    }

   
    // Image upload 
    async Upload_Image(Img) {
       this.setState({url1:''})
        console.log("image for firebaseImg", Img);
        let result = Img.size;
        console.log(typeof(result));
        if(result >'300000')
        {
            alert('Image size exceed 300kb. Please upload again')
            this.setState({isLoading:false});
            return
        }
      this.setState({img1:Img})

        this.setState({ ProgressBar: !this.state.ProgressBar })
        // const uploadTask = await firebase.storage().ref(`/Images/${Img.name}`).put(Img);
        this.setState({
            uploadTask: this.state.storageRef.child(`category_images/${Img.name}`).put(Img)
        },
            () => {
                this.state.uploadTask.on(
                    'state_changed',
                    snap => {
                        const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                        this.setState({ percentUploaded });
                      
                    },
                    err => {
                        console.error(err);
                    },
                    () => {
                        this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                            console.log('this is the image url', downloadUrl);
                               this.setState({url1:downloadUrl})
                              
                            let { Add_productData } = this.state;
                            Add_productData.Image_Name1 = downloadUrl;
                            this.setState({ Add_productData, ProgressBar: !this.state.ProgressBar }, () => console.log("1", this.state.Add_productData.Image_Name1))

                        })
                            .catch(err => {
                                console.error(err);
                            })
                    }
                )
            }
        )
    }
 
    render() {
        const { ProgressBar } = this.state;
        const pageButtonRenderer = ({ page, onPageChange }) => {
            const handleClick = (e) => {
                e.preventDefault();
                onPageChange(page);
            };
            return (
                <Button key={Math.random()} onClick={handleClick} > {page} </Button>
            );
        };

        const options = {
            pageButtonRenderer,
            paginationSize: 4,
            pageStartIndex: 1,
            // alwaysShowAllBtns: true, // Always show next and previous button
            // withFirstAndLast: false, // Hide the going to First and Last page button
            // hideSizePerPage: true, // Hide the sizePerPage dropdown always
            // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
            firstPageText: 'First',
            prePageText: 'Back',
            nextPageText: 'Next',
            lastPageText: 'Last',
            nextPageTitle: 'First page',
            prePageTitle: 'Pre page',
            firstPageTitle: 'Next page',
            lastPageTitle: 'Last page',
            showTotal: true,
            paginationTotalRenderer: customTotal,
            disablePageTitle: true,
            sizePerPageList: [{
                text: '5', value: 5
            }, {
                text: '10', value: 10
            }, {
                text: '20', value: 20
            }, {
                text: 'All', value: this.state.productsList.length
            }]  // A numeric array is also available. the purpose of above example is custom the text

        };

        return (
            <div>
                {this.state.isLoading ? <div style={{
                    left: 25,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    zIndex: 9999,
                    opacity: 0.2
                }}>
                    <Loader
                        visible={true}
                        // visible={true}
                        type="Oval"
                        color="#ff9900"
                        height={200}
                        width={200}
                    // timeout={3000} //3 secs
                    />
                </div> : null}

                <h1>Category Images</h1>
                <div style={{ marginTop: '5%' }}>
                    <div style={{ marginRight: 10, marginBottom: 10, marginTop: 10 }}>
                        <Button color="primary" size="md" className="mr-2" onClick={() => { this.AddModal(); }}>
                            Add Category Image
                        </Button>
                    </div>
                    <BootstrapTable
                    
                        // {...props.baseProps}
                        noDataIndication="Table is Empty"
                        keyField="id"
                        filter={filterFactory()}
                        data={this.state.productsList}
                        columns={this.state.columns}
                       
                        striped
                        hover height='200px'
                        condensed
                        //  bordered={false}
                        loading={true}
                        pagination={paginationFactory(options)}
                    />

                </div>

                {/* Add modal */}
                <Modal isOpen={this.state.addModal} toggle={() => this.AddModal()}
                    style={{ padding: '15px' }} centered>
                    <ModalHeader
                        // toggle={() => this.AddModal()}
                        // style={{ border: 'none' }}
                        cssModule={{
                            'modal-title': 'w-100 text-center', 'border-bottom': '0px',
                            'padding': '2rem 1rem 0rem 1rem'
                        }}>
                        <Label style={{ fontSize: 30, color: '#B87333' }} >Add new Image</Label>
                    </ModalHeader>
                    <ModalBody >
                        <Form>
                        <FormGroup>
                            <Label for="Category_Name">Category Name</Label>
                            <select type="select" value={this.state.Add_productData.Category_Name}
                                onChange={(e) => {
                                    const { Add_productData } = this.state;
                                    Add_productData.Category_Name = e.target.value;
                                    console.log("e.target.value :", e.target.value)
                                    this.setState({ Add_productData });
                                }}>
                                <option value="">{this.state.Add_productData.Category_Name}</option>
                                <option value="Wellness">Wellness</option>
                                <option value="DECOR">DECOR</option>
                                <option value="SPIRITUAL">SPIRITUAL</option>
                                <option value="TRADITIONAL">TRADITIONAL</option>
                            </select>
                        </FormGroup>
                        {/* {
                            (this.state.Add_productData.Category_Name=='Wellness')?
                            (
                                <FormGroup>
                                <Label for="exampleSelect">Sub-Category Name</Label>
                                <select type="select" name="select" id="exampleSelect"
                                    onChange={(e) => {
                                        const { Edit_ProductData } = this.state;
                                        Edit_ProductData.subCategory_Name = e.target.value;
                                        console.log("e.target.value :", e.target.value)
                                        this.setState({ Edit_ProductData });
                                    }}>
                                    <option value="">Select Option</option>
                                    <option value="Bottles">Bottles</option>
                                    <option value="Glass">Glass</option>
                                    <option value="Jar">Jar</option>
                                    <option value="Matka">Matka</option>
                                    <option value="Pawali">Pawali</option>
                                </select>
                            </FormGroup>
                            ):
                            <FormGroup></FormGroup>
                            } */}
                            <FormGroup>
                                {/* <Label for="Image_Name1">Image Name 1</Label> */}
                                <input type="file" name="Image_Name1" id="Image_Name1" placeholder="Enter Image Name 1" ref="upload" accept="image/*"
                                    onChange={(e) => {
                                        console.log("File selected", e.target.files[0]);
                                        this.Upload_Image(e.target.files[0])
                                    }} />
            
                                   {
                                   this.state.url1=='' ? <text style={{color:'red'}}>maximum size should be 300 kb<br></br>
                                    <text style={{color:'blue'}}>For better result, make Image dimension 1024*450</text></text>:null
                                    }
                                    
                            </FormGroup>
                            {this.state.ProgressBar ? <Progress value={this.state.percentUploaded} /> : null}
                            {this.state.url1?<img src={this.state.url1} style={{ width: 250, height: 100 }}></img>:null}
                            
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        {ProgressBar === false?
                            <Button color="primary" onClick={() => { this.setState({ isLoading: true }); this.Add_productData() }}>Confirm</Button>
                            : <Button color="primary" onClick={() => { console.log("Let images upload first"); alert("Let the Images upload first") }} >Confirm</Button>}
                        <Button color="secondary" onClick={() => this.AddModal()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}