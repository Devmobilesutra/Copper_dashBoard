import React, { Component } from 'react';
import fire from '../../fire';
import { FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Form } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Swal from 'sweetalert2';
import XLSX from 'xlsx';

const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total ml-2">
        Showing { from} to { to} of { size} Results
    </span>
);


export default class CategoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            file1: '',

            productsList: [],

            ProductId: '',

            addCategoryData: {
                category_name: '',
            },
            editProductData: {
                product_name: '',
            },

            // 
            editProductModal: false,

            addModal: false,

            columns: [
                {
                    dataField: 'category_name',
                    text: 'category Name',
                    align: 'center',
                    headerStyle: () => {
                        return { textAlign: 'center' };
                    },
                },
                // {
                //     dataField: 'color',
                //     text: 'Color',
                //     align: 'center',
                //     headerStyle: (colum, colIndex) => {
                //         return { textAlign: 'center' };
                //     },
                // },
                // {
                //     dataField: 'mrp',
                //     text: 'MRP',
                //     align: 'center',
                //     headerStyle: (colum, colIndex) => {
                //         return { textAlign: 'center' };
                //     },
                // },
                // {
                //     dataField: 'actualCost',
                //     text: 'Actual Cost',
                //     align: 'center',
                //     headerStyle: (colum, colIndex) => {
                //         return { textAlign: 'center' };
                //     },
                // },
                // {
                //     dataField: 'sellingPrize',
                //     text: 'Selling Prize',
                //     align: 'center',
                //     headerStyle: (colum, colIndex) => {
                //         return { textAlign: 'center' };
                //     },
                // },
                {
                    dataField: "Actions",
                    text: "Actions",
                    formatter: this.actionEditDeleteProduct,
                    align: 'center',
                    headerStyle: () => {
                        return { textAlign: 'center' };
                    },
                }
            ]
        };
    }

    componentDidMount() {
        fire.firestore().collection('Category').onSnapshot(data => {
            // console.log("cmpnentdid",data.size)
            this.setState({ productsList: [] });
            data.forEach(el => {
                console.log("el", el.data(), el.id)
                this.state.productsList.push({ id: el.id, ...el.data() })
                this.setState({})
                console.log("productsList", this.state.productsList);
            })
        })
    }

    actionEditDeleteProduct = (cell, row) => {
        var ProductId = row.id;
        var ProductName = row.category_name;

        return (
            <div>
                <Button color="primary" size="md" className="mr-2"
                    onClick={this.EditProduct.bind(this, ProductId, ProductName)}
                >
                    Edit
            </Button>
            &nbsp;&nbsp;
                <Button color="danger" size="md" className="mr-2"
                    onClick={this.DeleteProduct.bind(this, ProductId)}
                >
                    Delete
            </Button>
            </div>
        );
    }

    // edit product functions start here
    EditProduct(ProductId, ProductName) {
        let { editProductData } = this.state;
        editProductData.product_name = ProductName;
        console.log("peduct name", editProductData.product_name);
        this.setState({
            editProductData,
            ProductId: ProductId,
            editProductModal: !this.state.editProductModal,
        }, () => { console.log("peduct name", this.state.editProductData.product_name) });
    }
    toggleeditProductModal() {
        this.setState({
            editProductModal: !this.state.editProductModal,
        });
    }
    EditProductDetails() {
        console.log("EditProductDetails", this.state.editProductData)
        fire.firestore().collection('Category').doc(this.state.ProductId).update({
            category_name: this.state.editProductData.product_name,
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
    DeleteProduct(ProductId) {
        console.log("ProductId", ProductId);

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
                fire.firestore().collection('Category').doc(ProductId).delete().then(() => {
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
    AddModal() {
        console.log("ishwar")
        this.setState({ addModal: !this.state.addModal });
    }

    filePathset(e) {
        // console.log("jjjj");
        e.stopPropagation();
        e.preventDefault();
        var file = e.target.files[0];
        // console.log(file);
        this.setState({ file });

    }
    UploadExcel() {
        console.log("UploadExcel");
        var f = this.state.file;
        const reader = new FileReader();
        reader.onload = (evt) => {
            // evt = on_file_select event
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
            /* Update state */
            console.log("Data>>>" + data);// shows that excel data is read
            console.log(this.convertToJson(data)); // shows data in json format
        };
        reader.readAsBinaryString(f);
    }

    convertToJson(csv) {
        var lines = csv.split("\n");

        var result = [];

        var headers = lines[0].split(",");

        for (var i = 1; i < lines.length; i++) {
            var obj = {};
            var currentline = lines[i].split(",");

            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }

            console.log(i + " " + obj.firstName);
            if (obj.data !== undefined && obj.data !== "") {
                result.push(obj);
                // this.state.file1.push(obj);
                fire.firestore().collection('users1').doc(obj.data).set({
                    firstName: obj.firstName,
                    lastname: obj.lastname
                })
            }
        }

        //return result; //JavaScript object
        return JSON.stringify(result); //JSON
    }
    addCategoryData() {
        console.log("addCategoryData");
        console.log("ggg", this.state.addCategoryData.category_name);
        fire.firestore().collection('Category').add({
            category_name: this.state.addCategoryData.category_name
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
        let { addCategoryData } = this.state;
        addCategoryData.category_name = '';
        this.setState({
            addModal: !this.state.addModal,
            addCategoryData
        });
    }
    render() {
        const pageButtonRenderer = ({
            page,
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
                text: '50', value: 50
            }, {
                text: '100', value: 100
            }, {
                text: '200', value: 200
            }, {
                text: 'All', value: this.state.productsList.length
            }]  // A numeric array is also available. the purpose of above example is custom the text

        };
        return (
            <div>
                <h1>Category List</h1>
                {/* <h4>To show Products(All Items) list.....and facility to "Add new item" and "Update or Delete old items" </h4> */}
                <div style={{ marginTop: '5%' }}>
                    <div style={{ marginRight: 10, marginBottom: 10, marginTop: 10 }}>
                        <Button color="primary" size="md" className="mr-2" onClick={this.AddModal.bind(this)}>
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
                        <h2>Edit Category Details</h2>
                    </ModalHeader>
                    <ModalBody >
                        <FormGroup>
                            <Label for="AddCategory">Edit Category Name</Label>
                            <Input id="title" value={this.state.editProductData.product_name} onChange={(e) => {
                                let { editProductData } = this.state;
                                // console.lo("pppp", this.state.editProductData.product_name);
                                editProductData.product_name = e.target.value;
                                this.setState({ editProductData });
                            }} />
                            {/* <div style={{ fontSize:12, color: "red" }}>{this.state.addCatError}</div>  */}
                        </FormGroup>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.EditProductDetails.bind(this)}>Edit</Button>&nbsp;&nbsp;
                        <Button color="secondary" onClick={this.toggleeditProductModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                {/* Add user modal */}
                <Modal isOpen={this.state.addModal} toggle={this.AddModal.bind(this)}
                    style={{ padding: '15px' }} centered>
                    <ModalHeader toggle={this.AddModal.bind(this)}
                        style={{ border: 'none' }}
                        cssModule={{
                            'modal-title': 'w-100 text-center', 'border-bottom': '0px',
                            'padding': '2rem 1rem 0rem 1rem'
                        }}>
                        <h2>Add Category Details</h2>
                    </ModalHeader>
                    <ModalBody >
                        <FormGroup>
                            <Label for="AddCategory">Add Category Name</Label>
                            <Input id="title" value={this.state.addCategoryData.category_name} onChange={(e) => {
                                let { addCategoryData } = this.state;
                                addCategoryData.category_name = e.target.value;
                                this.setState({ addCategoryData });
                            }} />
                            <hr></hr>
                            <Label>Or You can upload a Excel also</Label>
                            <Input
                                type="file"
                                id="file"
                                ref="fileUploader"
                                onChange={(e) => this.filePathset(e)}
                                name="Excel_File">Choose file</Input>
                            <Button color="secondary" variant="contained" onClick={() => { this.UploadExcel() }}>Upload File</Button>
                            {/* <div style={{ fontSize:12, color: "red" }}>{this.state.addCatError}</div>  */}
                        </FormGroup>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.addCategoryData.bind(this)}>Add</Button>&nbsp;&nbsp;
                        <Button color="secondary" onClick={this.AddModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}