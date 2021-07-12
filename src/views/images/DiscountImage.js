import React, { Component } from 'react';
import { FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, Progress } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import Loader from "react-loader-spinner";
import Swal from 'sweetalert2';
import firebase from 'firebase';
const probe = require('probe-image-size');
firebase.storage().ref();
const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total ml-2">
        Showing {from} to {to} of {size} Results
    </span>
);

export default class ProductsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productsList: [],
            productsList1:[],
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
               
                Image_Name1: '',
              
            },
          
            addModal: false,

            columns: [
                
              
                {
                    dataField: 'index',
                    text: 'Advertisement Images',
                    align: 'center',
                    formatter: this.Img_Nm1,
                    headerStyle: () => {
                        
                        // return {textAlign: 'center' };
                    },
                },
              
                {
                    dataField: "Actions",
                    text: "Actions",
                     formatter: this.actionEditDeleteProduct,
                    align: 'center',
                    headerStyle: () => {
                        return {'width':'200px',textAlign: 'center'};
                    },
                }
            ]
        };
    }
    Img_Nm1 = (cell, row) => {
        return (
            <span style={{ display:'block', width:'400px',height:'200px',overflow: 'hidden' }}>
                {/* {row.Image_Name1} */}
                <img src={row.index} alt={row.index} />
            </span>
        )
    }

    componentDidMount() {
        console.log("ComponentDidMount");
        firebase.firestore().collection('Discount_Images').doc('Discount_Images')
        .get()
        .then((onSnapshot) => {
          console.log('User exists: ', onSnapshot.exists);
          console.log('User: ', onSnapshot.data().images);
          if (onSnapshot.data().images !== undefined) {
            onSnapshot.data().images.forEach((documentSnapshot) => {
            //   console.log('User ID: ', documentSnapshot);
            this.state.productsList1.push(documentSnapshot);
              this.state.productsList.push({'index':documentSnapshot});
            });
            this.setState({});
          }
        })   
        console.log(this.state.productsList,"ahfkjlh")
    }

    actionEditDeleteProduct = (cell, row) => {
        return (
            <div>
              
                &nbsp;&nbsp;
                <Button color="danger" size="md" className="mr-2"
                    onClick={() => { this.DeleteProduct(row.index) }}>
                    Delete
                </Button>
            </div>
        );
    }

   
    AddModal() {
        let { addModal } = this.state;
        this.setState({url1:''})
        this.setState({ addModal: !addModal });
    }
   

    // Delete Product 
    DeleteProduct(Product_ID) {
        console.log("ProductId", Product_ID);

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success ',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })
        swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                this.setState({ isLoading: !this.state.isLoading });

                this.setState({});
                var index = this.state.productsList1.indexOf(Product_ID);
                this.state.productsList1.splice(index, 1);
                this.state.productsList.splice(index, 1);
                console.log(this.state.productsList1,'hafjahg')
                firebase.firestore().collection('Discount_Images').doc('Discount_Images')
                  .update({
                    images: this.state.productsList1,
                  })

                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            text: "deleted",
                            confirmButtonColor: '#d33',
                            confirmButtonText: 'OK'
                        });
                        this.setState({ isLoading: !this.state.isLoading });
                    }).catch(error => {
                        console.log(error);
                        Swal.fire({
                            icon: 'error',
                            text: "Something went wrong",
                            confirmButtonColor: '#d33',
                            confirmButtonText: 'OK'
                        })
                        this.setState({ isLoading: !this.state.isLoading });
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) { }
        })
        // this.setState({ isLoading: !this.state.isLoading });
    }

    async Add_productData() {
        var len=this.state.productsList1.length
        console.log(len,'length')
        for(var i=0;i<len;i++)
        {
            console.log(this.state.productsList1[i])
            console.log( this.state.productsList1[i].includes(this.state.img1.name))
            if(this.state.productsList1[i].includes(this.state.img1.name)===true)
            {
                alert('Image allready available,please select another image');
                this.setState({ isLoading: false });
                return
            }
        }
        const { Add_productData } = this.state;
        console.log()
        let result = await probe(this.state.url1);
        console.log(result);
         if (!Add_productData.Image_Name1) {
            alert('Please select Image');
            this.setState({ isLoading: false });
            return
         }
         else if(result.length>'300000')
         {
             alert('Image size exceed 300kb. Please upload again')
             this.setState({isLoading:false});
             return
         }
         this.state.productsList.push({index:this.state.Add_productData.Image_Name1});
         this.state.productsList1.push(this.state.Add_productData.Image_Name1);
         this.setState({});
         firebase.firestore().collection('Discount_Images').doc('Discount_Images')
           .update({
            images: this.state.productsList1,
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

   
    // Image upload for add form
    async Upload_Image(Img) {
       this.setState({url1:''})
        console.log("image for firebaseImg", Img);

      this.setState({img1:Img})

        this.setState({ ProgressBar: !this.state.ProgressBar })
        // const uploadTask = await firebase.storage().ref(`/Images/${Img.name}`).put(Img);
        this.setState({
            uploadTask: this.state.storageRef.child(`Discount_Images/${Img.name}`).put(Img)
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

                <h1>Advertisement Images</h1>
                <div style={{ marginTop: '5%' }}>
                    <div style={{ marginRight: 10, marginBottom: 10, marginTop: 10 }}>
                        <Button color="primary" size="md" className="mr-2" onClick={() => { this.AddModal(); }}>
                            Add New Image
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
                                {/* <Label for="Image_Name1">Image Name 1</Label> */}
                                <input type="file" name="Image_Name1" id="Image_Name1" placeholder="Enter Image Name 1" ref="upload" accept="image/*"
                                    onChange={(e) => {
                                        console.log("File selected", e.target.files[0]);
                                        this.Upload_Image(e.target.files[0])
                                    }} /><text style={{color:'red'}}>maximum size should be 300 kb</text>
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