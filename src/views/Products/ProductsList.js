import React, { Component } from 'react';
// import firebase from 'firebase/firestore'
// import firebase from '../../fire';
import { FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Form } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Swal from 'sweetalert2';
import XLSX from 'xlsx';
import firebase from 'firebase';

const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total ml-2">
        Showing { from} to { to} of { size} Results
    </span>
);


export default class ProductsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productsList: [],

            ProductId: '',

            //Add Product data
            Add_productData: {
                Sr_No: '',
                Category_Name: '',
                Product_Name: '',
                Product_ID: '',
                Cost_Price: '',
                Selling_Price: '',
                MRP: '',
                Weight: '',
                Usage: '',
                How_to_clean: '',
                Image_Name1: '',
                Image_Name2: '',
                Image_Name3: '',
                Image_Name4: '',
                IsActive: ''
            },
            Edit_ProductData: {
                Sr_No: '',
                Category_Name: '',
                Product_Name: '',
                Product_ID: '',
                Cost_Price: '',
                Selling_Price: '',
                MRP: '',
                Weight: '',
                Usage: '',
                How_to_clean: '',
                Image_Name1: '',
                Image_Name2: '',
                Image_Name3: '',
                Image_Name4: '',
                IsActive: ''
            },

            editProductModal: false,

            addModal: false,

            columns: [
                {
                    dataField: 'Sr_No',
                    text: 'Sr No',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Product_ID',
                    text: 'Product ID',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Product_Name',
                    text: 'Product Name',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Category_Name',
                    text: 'Category Name',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Cost_Price',
                    text: 'Cost Price',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Selling_Price',
                    text: 'Selling Price',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Usage',
                    text: 'Usage',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'How_to_clean',
                    text: 'How to clean',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'IsActive',
                    text: 'IsActive',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'MRP',
                    text: 'MRP',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Image_Name1',
                    text: 'Image Name1',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Weight',
                    text: 'Weight',
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Image_Name2',
                    text: 'Image Name2',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Image_Name3',
                    text: 'Image Name2',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Image_Name4',
                    text: 'Image Name2',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: "Actions",
                    text: "Actions",
                    formatter: this.actionEditDeleteProduct,
                    align: 'center',
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                }
            ]
        };
    }

    componentDidMount() {
        firebase.firestore().collection('Products').onSnapshot(data => {
            // console.log("cmpnentdid",data.size)
            this.setState({ productsList: [] });
            data.forEach(el => {
                console.log("el", el.data(), el.id)
                this.state.productsList.push({ id: el.id, ...el.data() })
                this.setState({})
                console.log("productsList", this.state.productsList)
            })
        })
    }

    actionEditDeleteProduct = (cell, row, rowIndex, formatExtraData) => {
        var ProductId = row.id;
        var ProductName = row.productName;
        return (
            <div>
                <Button color="primary" size="md" className="mr-2"
                    onClick={() => this.EditProduct(row.Sr_No, row.Category_Name, row.Product_Name, row.Product_ID, row.Cost_Price, row.Selling_Price, row.MRP, row.Weight, row.Usage, row.How_to_clean, row.Image_Name1, row.Image_Name2, row.Image_Name3, row.Image_Name4, row.IsActive
                    )}>
                    Edit
            </Button>
            &nbsp;&nbsp;
                <Button color="danger" size="md" className="mr-2"
                    onClick={() => this.DeleteProduct(row.Product_ID)}
                >
                    Delet
            </Button>
            </div>
        );
    }

    // edit product functions start here
    EditProduct(
        Sr_No,
        Category_Name,
        Product_Name,
        Product_ID,
        Cost_Price,
        Selling_Price,
        MRP,
        Weight,
        Usage,
        How_to_clean,
        Image_Name1,
        Image_Name2,
        Image_Name3,
        Image_Name4,
        IsActive) {

        console.log("\nSr_No", Sr_No, "\n Category_Name", Category_Name, "\n Product_Name", Product_Name, "\n Product_ID", Product_ID, "\n Cost_Price", Cost_Price, "\n Selling_Price", Selling_Price, "\n MRP", MRP, "\n Weight", Weight, "\n Usage", Usage, "\n How_to_clean", How_to_clean, "\n Image_Name1", Image_Name1, "\n ", Image_Name2, "\n ", Image_Name3, "\n Image_Name4", Image_Name4, "\n IsActive", IsActive);
        const { Edit_ProductData } = this.state;
        Edit_ProductData.Product_Name = Product_Name;
        Edit_ProductData.Category_Name = Category_Name;
        Edit_ProductData.Cost_Price = Cost_Price;
        Edit_ProductData.Selling_Price = Selling_Price;
        Edit_ProductData.Product_ID = Product_ID;
        Edit_ProductData.MRP = MRP;
        Edit_ProductData.Weight = Weight;
        Edit_ProductData.Usage = Usage;
        Edit_ProductData.Image_Name1 = Image_Name1;
        Edit_ProductData.Image_Name2 = Image_Name2;
        Edit_ProductData.Image_Name3 = Image_Name3;
        Edit_ProductData.Image_Name4 = Image_Name4;
        Edit_ProductData.How_to_clean = How_to_clean;
        Edit_ProductData.IsActive = IsActive;

        this.setState({
            Edit_ProductData,
            // ProductId: ProductId,
            editProductModal: !this.state.editProductModal,
        });
    }
    AddModal() {
        let { addModal } = this.state;
        this.setState({ addModal: !addModal });
    }
    toggleeditProductModal() {
        this.setState({
            editProductModal: !this.state.editProductModal,
        });
    }
    EditProductDetails() {
        const { Edit_ProductData } = this.state;
        console.log("EditProductDetails", Edit_ProductData);
        firebase.firestore().collection('Products').doc(Edit_ProductData.Product_ID).update({
            Category_Name: Edit_ProductData.Category_Name,
            Product_Name: Edit_ProductData.Product_Name,
            Cost_Price: Edit_ProductData.Cost_Price,
            Selling_Price: Edit_ProductData.Selling_Price,
            MRP: Edit_ProductData.MRP,
            Weight: Edit_ProductData.Weight,
            Usage: Edit_ProductData.Usage,
            How_to_clean: Edit_ProductData.How_to_clean,
            Image_Name1: Edit_ProductData.Image_Name1,
            Image_Name2: Edit_ProductData.Image_Name2,
            Image_Name3: Edit_ProductData.Image_Name3,
            Image_Name4: Edit_ProductData.Image_Name4,
            IsActive: Edit_ProductData.IsActive
        }).then(() => {
            Swal.fire({
                icon: 'success',
                text: "Data Updated Succesfully",
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
        this.setState({
            editProductModal: !this.state.editProductModal,
        });
    }
    // //////////////edit product functions ede here

    // 
    DeleteProduct(Product_ID) {
        console.log("ProductId", Product_ID);
        let idtoDelete = Product_ID;

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
                firebase.firestore().collection('Products').doc(Product_ID).delete().then(() => {
                    Swal.fire({
                        icon: 'success',
                        text: "deleted",
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
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) { }
        })
    }

    Add_productData() {
        console.log("Add_productData", this.state.Add_productData);
        // var { Add_productData } = this.state;
        firebase.firestore().collection('Products').doc(this.state.Add_productData.Product_ID).set({
            // category_name: this.state.addCategoryData.category_name

            Sr_No: this.state.Add_productData.Sr_No,
            Category_Name: this.state.Add_productData.Category_Name,
            Product_Name: this.state.Add_productData.Product_Name,
            Product_ID: this.state.Add_productData.Product_ID,
            Cost_Price: this.state.Add_productData.Cost_Price,
            Selling_Price: this.state.Add_productData.Selling_Price,
            MRP: this.state.Add_productData.MRP,
            Weight: this.state.Add_productData.Weight,
            Usage: this.state.Add_productData.Usage,
            How_to_clean: this.state.Add_productData.How_to_clean,
            Image_Name1: this.state.Add_productData.Image_Name1,
            Image_Name2: this.state.Add_productData.Image_Name2,
            Image_Name3: this.state.Add_productData.Image_Name3,
            Image_Name4: this.state.Add_productData.Image_Name4,
            IsActive: this.state.Add_productData.IsActive

        }).then(() => {
            Swal.fire({
                icon: 'success',
                text: "Data Added Succesfully",
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
        this.setState({
            addModal: !this.state.addModal,
            Sr_No: '',
            Category_Name: '',
            Product_Name: '',
            Product_ID: '',
            Cost_Price: '',
            Selling_Price: '',
            MRP: '',
            Weight: '',
            Usage: '',
            How_to_clean: '',
            Image_Name1: '',
            Image_Name2: '',
            Image_Name3: '',
            Image_Name4: '',
            IsActive: ''
        })
    }
    //Excel Upload
    filePathset(e) {
        // console.log("jjjj");
        e.stopPropagation();
        e.preventDefault();
        var file = e.target.files[0];
        // console.log(file);
        this.setState({ file });

    }
    async UploadExcel() {
        console.log("UploadExcel");
        var f = this.state.file;
        var name = f.name;
        let result = [];
        const reader = new FileReader();
        reader.readAsBinaryString(f);
        reader.onload = (evt) => {
            // evt = on_file_select event
            /* Parse data */
            const binary_str = evt.target.result;
            const Workbook = XLSX.read(binary_str, { type: "binary" });
            let rowObject;
            Workbook.SheetNames.forEach(sheet => {
                rowObject = XLSX.utils.sheet_to_row_object_array(Workbook.Sheets[sheet]);
                console.log("object", rowObject);
                result.push(rowObject);
            });
            console.log("result array", result);
            this.upload_data(result);
        };
    }
    async upload_data(Array_of_Object) {
        console.log("this is row object", Array_of_Object);
        Array_of_Object[0].forEach(rowObject => {
            console.log(
                "///////////////////////",
                "\n Sr_No ", rowObject.Sr_No,
                "\n Product_ID ", rowObject.Product_ID,
                "\n Category_Name ", rowObject.Category_Name,
                "\n Product_Name ", rowObject.Product_Name,
                "\n Cost_Price  ", rowObject.Cost_Price,
                "\n Selling_Price ", rowObject.Selling_Price,
                "\n MRP ", rowObject.MRP,
                "\n Weight ", rowObject.Weight,
                "\n Usage ", rowObject.Usage,
                "\n How_to_clean ", rowObject.How_to_clean,
                "\n Image_Name1 ", rowObject.Image_Name1,
                "\n Image_Name2 ", rowObject.Image_Name2,
                "\n Image_Name3 ", rowObject.Image_Name3,
                "\n Image_Name4 ", rowObject.Image_Name4,
                "\n IsActive ", rowObject.IsActive
            );
            firebase.firestore().collection('Products').doc(rowObject.Product_ID).set({
                Sr_No: rowObject.Sr_No,
                Product_ID: rowObject.Product_ID,
                Category_Name: rowObject.Category_Name,
                Product_Name: rowObject.Product_Name,
                Cost_Price: rowObject.Cost_Price === undefined ? null : rowObject.Cost_Price,
                Selling_Price: rowObject.Selling_Price,
                MRP: rowObject.MRP,
                Weight: rowObject.Weight,
                Usage: rowObject.Usage,
                How_to_clean: rowObject.How_to_clean,
                Image_Name1: rowObject.Image_Name1,
                Image_Name2: rowObject.Image_Name2 === undefined ? null : rowObject.Image_Name2,
                Image_Name3: rowObject.Image_Name3 === undefined ? null : rowObject.Image_Name3,
                Image_Name4: rowObject.Image_Name4 === undefined ? null : rowObject.Image_Name4,
                IsActive: rowObject.IsActive
            }).then(() => {
                console.log("Data Uploaded Succefully");
            })

        });
        this.setState({ addModal: !this.state.addModal })
    }
    render() {
        const pageButtonRenderer = ({
            page,
            active,
            disable,
            title,
            onPageChange
        }) => {
            const handleClick = (e) => {
                e.preventDefault();
                onPageChange(page);
            };
            return (
                <Button outline color="danger" className="mr-2" onClick={handleClick} > {page} </Button>
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
                text: '50', value: 5
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
                <h1>Products List</h1>
                {/* <h4>To show Products(All Items) list.....and facility to "Add new item" and "Update or Delete old items" </h4> */}
                <div style={{ marginTop: '5%' }}>
                    <div style={{ marginRight: 10, marginBottom: 10, marginTop: 10 }}>
                        <Button color="primary" size="md" className="mr-2" onClick={() => { this.AddModal(); }}>
                            Add
                        </Button>
                    </div>
                    <BootstrapTable
                        // {...props.baseProps}
                        noDataIndication="Table is Empty"
                        keyField="id"
                        data={this.state.productsList}
                        columns={this.state.columns}
                        striped
                        hover
                        condensed
                        bordered={false}
                        loading={true}
                        pagination={paginationFactory(options)}
                    />
                </div>

                {/* Confirm user modal */}
                <Modal isOpen={this.state.editProductModal} toggle={this.toggleeditProductModal.bind(this)}
                    style={{ padding: '15px' }} centered>
                    <ModalHeader toggle={this.toggleeditProductModal.bind(this)}
                        style={{ border: 'none' }}
                        cssModule={{
                            'modal-title': 'w-100 text-center', 'border-bottom': '0px',
                            'padding': '2rem 1rem 0rem 1rem'
                        }}>
                        <h2>Edit Product Details</h2>
                    </ModalHeader>
                    <ModalBody >
                        {/* <FormGroup>
                            <Label for="Product_ID">Product ID</Label>
                            <Input type="text" name="Product_ID" id="Product_ID" placeholder="Enter Product ID"
                                value={this.state.Edit_ProductData.Product_ID}
                                onChange={(e) => {
                                    const { Edit_ProductData } = this.state;
                                    Edit_ProductData.Product_ID = e.target.value;
                                    this.setState({ Edit_ProductData });
                                }} />
                        </FormGroup> */}
                        <FormGroup>
                            <Label for="Product_Name">Product Name</Label>
                            <Input type="text" name="Product_Name" id="Product_Name" placeholder="Enter Product Name"
                                value={this.state.Edit_ProductData.Product_Name}
                                onChange={(e) => {
                                    const { Edit_ProductData } = this.state;
                                    Edit_ProductData.Product_Name = e.target.value;
                                    this.setState({ Edit_ProductData });
                                }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="Category_Name">Category Name</Label>
                            <Input type="text" name="Category_Name" id="Category_Name" placeholder="Enter Category Name"
                                value={this.state.Edit_ProductData.Category_Name}
                                onChange={(e) => {
                                    const { Edit_ProductData } = this.state;
                                    Edit_ProductData.Category_Name = e.target.value;
                                    this.setState({ Edit_ProductData });
                                }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="Cost_Price">Cost Price</Label>
                            <Input type="number" name="Cost_Price" id="Cost_Price" placeholder="Enter Cost Price"
                                value={this.state.Edit_ProductData.Cost_Price}
                                onChange={(e) => {
                                    const { Edit_ProductData } = this.state;
                                    Edit_ProductData.Cost_Price = e.target.value;
                                    this.setState({ Edit_ProductData });
                                }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="Selling_Price">Selling Price</Label>
                            <Input type="number" name="Selling_Price" id="Selling_Price" placeholder="Enter Selling Price"
                                value={this.state.Edit_ProductData.Selling_Price}
                                onChange={(e) => {
                                    const { Edit_ProductData } = this.state;
                                    Edit_ProductData.Selling_Price = e.target.value;
                                    this.setState({ Edit_ProductData });
                                }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="MRP">MRP</Label>
                            <Input type="number" name="MRP" id="MRP" placeholder="Enter MRP"
                                value={this.state.Edit_ProductData.MRP}
                                onChange={(e) => {
                                    const { Edit_ProductData } = this.state;
                                    Edit_ProductData.MRP = e.target.value;
                                    this.setState({ Edit_ProductData });
                                }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="Weight">Weight</Label>
                            <Input type="text" name="Weight" id="Weight" placeholder="Enter Weight"
                                value={this.state.Edit_ProductData.Weight}
                                onChange={(e) => {
                                    const { Edit_ProductData } = this.state;
                                    Edit_ProductData.Weight = e.target.value;
                                    this.setState({ Edit_ProductData });
                                }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="Usage">Usage</Label>
                            <Input type="text" name="Usage" id="Usage" placeholder="Enter Usage"
                                value={this.state.Edit_ProductData.Usage}
                                onChange={(e) => {
                                    const { Edit_ProductData } = this.state;
                                    Edit_ProductData.Usage = e.target.value;
                                    this.setState({ Edit_ProductData });
                                }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="How_to_clean">How to clean</Label>
                            <Input type="text" name="How_to_clean" id="How_to_clean" placeholder="Enter How to clean"
                                value={this.state.Edit_ProductData.How_to_clean}
                                onChange={(e) => {
                                    const { Edit_ProductData } = this.state;
                                    Edit_ProductData.How_to_clean = e.target.value;
                                    this.setState({ Edit_ProductData });
                                }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="Image_Name1">Image Name1</Label>
                            <Input type="text" name="Image_Name1" id="Image_Name1" placeholder="Enter Image Name1"
                                value={this.state.Edit_ProductData.Image_Name1}
                                onChange={(e) => {
                                    const { Edit_ProductData } = this.state;
                                    Edit_ProductData.Image_Name1 = e.target.value;
                                    this.setState({ Edit_ProductData });
                                }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="Image_Name 2">Image Name 2</Label>
                            <Input type="text" name="Image_Name2" id="Image_Name2" placeholder="Enter Image Name 2"
                                value={this.state.Edit_ProductData.Image_Name2}
                                onChange={(e) => {
                                    const { Edit_ProductData } = this.state;
                                    Edit_ProductData.Image_Name2 = e.target.value;
                                    this.setState({ Edit_ProductData });
                                }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="Image_Name3">Image Name 3</Label>
                            <Input type="text" name="Image_Name3" id="Image_Name3" placeholder="Enter Image_Name3"
                                value={this.state.Edit_ProductData.Image_Name3}
                                onChange={(e) => {
                                    const { Edit_ProductData } = this.state;
                                    Edit_ProductData.Image_Name3 = e.target.value;
                                    this.setState({ Edit_ProductData });
                                }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="Image_Name4">Image Name 4</Label>
                            <Input type="text" name="Image_Name4" id="Image_Name4" placeholder="Enter Image Name 4"
                                value={this.state.Edit_ProductData.Image_Name4}
                                onChange={(e) => {
                                    const { Edit_ProductData } = this.state;
                                    Edit_ProductData.Image_Name4 = e.target.value;
                                    this.setState({ Edit_ProductData });
                                }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="IsActive">IsActive</Label>
                            <Input type="text" name="IsActive" id="IsActive" placeholder="Enter IsActive"
                                value={this.state.Edit_ProductData.IsActive}
                                onChange={(e) => {
                                    const { Edit_ProductData } = this.state;
                                    Edit_ProductData.IsActive = e.target.value;
                                    this.setState({ Edit_ProductData });
                                }} />
                        </FormGroup>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.EditProductDetails.bind(this)}>Edit</Button>&nbsp;&nbsp;
                        <Button color="secondary" onClick={this.toggleeditProductModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                {/* Add user modal */}
                <Modal isOpen={this.state.addModal} toggle={() => this.AddModal()}
                    style={{ padding: '15px' }} centered>
                    <ModalHeader
                        // toggle={() => this.AddModal()}
                        // style={{ border: 'none' }}
                        cssModule={{
                            'modal-title': 'w-100 text-center', 'border-bottom': '0px',
                            'padding': '2rem 1rem 0rem 1rem'
                        }}>
                        <Label style={{ fontSize: 30, color: '#B87333' }} >Add Category</Label>
                    </ModalHeader>
                    <ModalBody >
                        <Form>
                            <FormGroup>
                                <Label for="Product_ID">Product ID</Label>
                                <Input type="text" name="Product_ID" id="Product_ID" placeholder="Enter Product ID"
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        Add_productData.Product_ID = e.target.value;
                                        this.setState({ Add_productData });
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="Product_Name">Product Name</Label>
                                <Input type="text" name="Product_Name" id="Product_Name" placeholder="Enter Product Name"
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        Add_productData.Product_Name = e.target.value;
                                        this.setState({ Add_productData });
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="Category_Name">Category Name</Label>
                                <Input type="text" name="Category_Name" id="Category_Name" placeholder="Enter Category Name"
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        Add_productData.Category_Name = e.target.value;
                                        this.setState({ Add_productData });
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="Cost_Price">Cost Price</Label>
                                <Input type="number" name="Cost_Price" id="Cost_Price" placeholder="Enter Cost Price"
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        Add_productData.Cost_Price = e.target.value;
                                        this.setState({ Add_productData });
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="Selling_Price">Selling Price</Label>
                                <Input type="number" name="Selling_Price" id="Selling_Price" placeholder="Enter Selling Price"
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        Add_productData.Selling_Price = e.target.value;
                                        this.setState({ Add_productData });
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="MRP">MRP</Label>
                                <Input type="number" name="MRP" id="MRP" placeholder="Enter MRP"
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        Add_productData.MRP = e.target.value;
                                        this.setState({ Add_productData });
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="Weight">Weight</Label>
                                <Input type="text" name="Weight" id="Weight" placeholder="Enter Weight"
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        Add_productData.Weight = e.target.value;
                                        this.setState({ Add_productData });
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="Usage">Usage</Label>
                                <Input type="text" name="Usage" id="Usage" placeholder="Enter Usage"
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        Add_productData.Usage = e.target.value;
                                        this.setState({ Add_productData });
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="How_to_clean">How to clean</Label>
                                <Input type="text" name="How_to_clean" id="How_to_clean" placeholder="Enter How to clean"
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        Add_productData.How_to_clean = e.target.value;
                                        this.setState({ Add_productData });
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="Image_Name1">Image Name1</Label>
                                <Input type="text" name="Image_Name1" id="Image_Name1" placeholder="Enter Image Name1"
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        Add_productData.Image_Name1 = e.target.value;
                                        this.setState({ Add_productData });
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="Image_Name 2">Image Name 2</Label>
                                <Input type="text" name="Image_Name2" id="Image_Name2" placeholder="Enter Image Name 2"
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        Add_productData.Image_Name2 = e.target.value;
                                        this.setState({ Add_productData });
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="Image_Name3">Image Name 3</Label>
                                <Input type="text" name="Image_Name3" id="Image_Name3" placeholder="Enter Image_Name3"
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        Add_productData.Image_Name3 = e.target.value;
                                        this.setState({ Add_productData });
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="Image_Name4">Image Name 4</Label>
                                <Input type="text" name="Image_Name4" id="Image_Name4" placeholder="Enter Image Name 4"
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        Add_productData.Image_Name4 = e.target.value;
                                        this.setState({ Add_productData });
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="IsActive">IsActive</Label>
                                <Input type="text" name="IsActive" id="IsActive" placeholder="Enter IsActive"
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        Add_productData.IsActive = e.target.value;
                                        this.setState({ Add_productData });
                                    }} />
                            </FormGroup>
                            <hr></hr>
                            <Label>Or You can upload a Excel also</Label>
                            <Input
                                type="file"
                                id="file"
                                accept=".xls,.xlsx"
                                // ref="fileUploader"
                                onChange={(e) => this.filePathset(e)}
                                name="Excel_File">Choose file</Input>
                            <Button color="secondary" variant="contained" onClick={() => { this.UploadExcel() }}>Upload File</Button>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.Add_productData()}>Confirm</Button>
                        <Button color="secondary" onClick={() => this.AddModal()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}