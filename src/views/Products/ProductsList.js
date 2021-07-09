import React, { Component } from 'react';
import { Alert, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Form, Progress } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import Loader from "react-loader-spinner";
import Swal from 'sweetalert2';
import XLSX from 'xlsx';
import firebase from 'firebase';

const storageRef = firebase.storage().ref();
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
            PDF_productsList: [],

            url: '',
            Excel_Modal: false,
            file: '',
            isLoading: false,

            //Add Images
            percentUploaded: null,
            percentUploaded2: null,
            percentUploaded3: null,
            percentUploaded4: null,

            ProgressBar: false,
            ProgressBar2: false,
            ProgressBar3: false,
            ProgressBar4: false,

            storageRef: firebase.storage().ref(),
            storageRef2: firebase.storage().ref(),
            storageRef3: firebase.storage().ref(),
            storageRef4: firebase.storage().ref(),

            uploadTask: null,
            uploadTask2: null,
            uploadTask3: null,
            uploadTask4: null,

            //Edit Images
            EpercentUploaded: null,
            EpercentUploaded2: null,
            EpercentUploaded3: null,
            EpercentUploaded4: null,

            EProgressBar: false,
            EProgressBar2: false,
            EProgressBar3: false,
            EProgressBar4: false,

            EstorageRef: firebase.storage().ref(),
            EstorageRef2: firebase.storage().ref(),
            EstorageRef3: firebase.storage().ref(),
            EstorageRef4: firebase.storage().ref(),

            EuploadTask: null,
            EuploadTask2: null,
            EuploadTask3: null,
            EuploadTask4: null,

            //Add Product data
            Add_productData: {
                Sr_No: '',
                Category_Name: '',
                subCategory_Name:'',
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
                subCategory_Name:'',
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
                    dataField: 'id',
                    text: 'id',
                    align: 'center',
                    hidden: true,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
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
                    filter: textFilter({
                        placeholder: 'Search Product Name'
                    }),
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Category_Name',
                    text: 'Category Name',
                    align: 'center',
                    filter: textFilter({
                        placeholder: 'Search Category Name'
                    }),
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
                    filter: textFilter({
                        placeholder: 'Search by MRP'
                    }),
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Image_Name1',
                    text: 'Image Name1',
                    align: 'center',
                    formatter: this.Img_Nm1,
                    headerStyle: (colum, colIndex) => {
                        return { textAlign: 'center' };
                    },
                },
                {
                    dataField: 'Weight',
                    text: 'Weight',
                    align: 'center',
                    filter: textFilter({
                        placeholder: 'Search by Weight'
                    }),
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
                    // formatter: this.Img_Nm4,
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
    Img_Nm1 = (cell, row, rowIndex, formatExtraData) => {
        return (
            <span style={{ display: 'block', width: '150px', overflow: 'hidden' }}>
                {/* {row.Image_Name1} */}
                <img src={row.Image_Name1} alt={row.Image_Name1} />
            </span>
        )
    }

    componentDidMount() {
        console.log("ComponentDidMount");
        firebase.firestore().collection('Products').onSnapshot(data => {
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

    actionEditDeleteProduct = (cell, row, rowIndex, formatExtraData) => {
        var ProductId = row.id;
        return (
            <div>
                <Button color="primary" size="md" className="mr-2"
                    onClick={() => { this.EditProduct(row.Sr_No, row.Category_Name, row.Product_Name, row.id, row.Cost_Price, row.Selling_Price, row.MRP, row.Weight, row.Usage, row.How_to_clean, row.Image_Name1, row.Image_Name2, row.Image_Name3, row.Image_Name4, row.IsActive) }}>
                    Edit
                </Button>
                &nbsp;&nbsp;
                <Button color="danger" size="md" className="mr-2"
                    onClick={() => { this.DeleteProduct(row.id) }}>
                    Delete
                </Button>
            </div>
        );
    }

    // edit product functions start here
    EditProduct(
        Sr_No,
        Category_Name,
        subCategory_Name,
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
        Edit_ProductData.subCategory_Name=subCategory_Name;
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
        console.log("is Loading", this.state.isLoading)
        console.log("Edit_ProductData", this.state.Edit_ProductData);
        var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        console.log("category name", Edit_ProductData.Category_Name);
        console.log("Product_ID", Edit_ProductData.Product_ID);
        console.log("Image 1", Edit_ProductData.Image_Name1, "typeof image", typeof (Edit_ProductData.Image_Name1));

        if (!Edit_ProductData.Category_Name) {
            alert('please select category name');
            this.setState({ isLoading: false });
            return
        }else if (Edit_ProductData.Category_Name=='Wellness' && !Edit_ProductData.subCategory_Name) {
            alert('Please select Sub category Name');
            this.setState({ isLoading: false });
            return
        } else if (!Edit_ProductData.Product_Name) {
            alert('Please select Product Name');
            this.setState({ isLoading: false });
            return
        }
         else if (!Edit_ProductData.Cost_Price) {
            alert('Please select Cost Price');
            this.setState({ isLoading: false });
            return
        } else if (format.test(Edit_ProductData.Cost_Price)) {
            console.log("checking format", format.test(Edit_ProductData.Cost_Price))
            alert("Please select valid Cost Price")
            this.setState({ isLoading: false });
            return
        } else if (!Edit_ProductData.Selling_Price) {
            alert('Please select Selling_Price');
            this.setState({ isLoading: false });
            return
        } else if (format.test(Edit_ProductData.Selling_Price)) {
            console.log("checking format", format.test(Edit_ProductData.Selling_Price))
            alert("Please select valid Selling Price")
            this.setState({ isLoading: false });
            return
        } else if (!Edit_ProductData.MRP) {
            alert('Please select MRP');
            this.setState({ isLoading: false });
            return
        } else if (format.test(Edit_ProductData.MRP)) {
            console.log("checking format", format.test(Edit_ProductData.MRP))
            alert("Please select valid MRP")
            this.setState({ isLoading: false });
            return
        } else if (!Edit_ProductData.Weight) {
            alert('Please select Weight');
            this.setState({ isLoading: false });
            return
        } else if (!Edit_ProductData.Usage) {
            alert('Please select Usage');
            this.setState({ isLoading: false });
            return
        } else if (!Edit_ProductData.How_to_clean) {
            alert('Please select How_to_clean');
            this.setState({ isLoading: false });
            return
        } else if (!Edit_ProductData.IsActive) {
            alert('Please select IsActive');
            this.setState({ isLoading: false });
            return
        } else if (!Edit_ProductData.Image_Name1) {
            alert('Please select Image_Name 1');
            this.setState({ isLoading: false });
            return
        } else if (!Edit_ProductData.Image_Name2) {
            alert('Please select Image_Name 2');
            this.setState({ isLoading: false });
            return
        } else if (!Edit_ProductData.Image_Name3) {
            alert('Please select Image_Name 3');
            this.setState({ isLoading: false });
            return
        } else if (!Edit_ProductData.Image_Name4) {
            alert('Please select Image_Name 4');
            this.setState({ isLoading: false });
            return
        }

        firebase.firestore().collection('Products').doc(Edit_ProductData.Product_ID).update({
            Category_Name: Edit_ProductData.Category_Name,
            subCategory_Name:Edit_ProductData.subCategory_Name,
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
            this.setState({
                editProductModal: !this.state.editProductModal,
                isLoading: !this.state.isLoading,
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
                this.setState({
                    editProductModal: !this.state.editProductModal,
                    isLoading: !this.state.isLoading,
                });
            });
    }

    // Delete Product 
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
                this.setState({ isLoading: !this.state.isLoading });
                firebase.firestore().collection('Products').doc(Product_ID).delete()
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
        console.log("is Loading", this.state.isLoading)
        console.log("Add_productData", this.state.Add_productData);
        const { Add_productData } = this.state;
        var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        console.log("category name", Add_productData.Category_Name);
        console.log("Image 1", Add_productData.Image_Name1, "typeof image", typeof (Add_productData.Image_Name1));

        if (!Add_productData.Category_Name) {
            alert('please select category name');
            this.setState({ isLoading: false });
            return
        } else if (Add_productData.Category_Name=='Wellness' && !Add_productData.subCategory_Name) {
            alert('Please select sub category Name');
            this.setState({ isLoading: false });
            return
        } else if (!Add_productData.Product_Name) {
            alert('Please select Product Name');
            this.setState({ isLoading: false });
            return
        } else if (!Add_productData.Cost_Price) {
            alert('Please select Cost Price');
            this.setState({ isLoading: false });
            return
        } else if (format.test(Add_productData.Cost_Price)) {
            console.log("checking format", format.test(Add_productData.Cost_Price))
            alert("Please select valid Cost Price")
            this.setState({ isLoading: false });
            return
        } else if (!Add_productData.Selling_Price) {
            alert('Please select Selling_Price');
            this.setState({ isLoading: false });
            return
        } else if (format.test(Add_productData.Selling_Price)) {
            console.log("checking format", format.test(Add_productData.Selling_Price))
            alert("Please select valid Selling Price")
            this.setState({ isLoading: false });
            return
        } else if (!Add_productData.MRP) {
            alert('Please select MRP');
            this.setState({ isLoading: false });
            return
        } else if (format.test(Add_productData.MRP)) {
            console.log("checking format", format.test(Add_productData.MRP))
            alert("Please select valid MRP")
            this.setState({ isLoading: false });
            return
        } else if (!Add_productData.Weight) {
            alert('Please select Weight');
            this.setState({ isLoading: false });
            return
        } else if (!Add_productData.Usage) {
            alert('Please select Usage');
            this.setState({ isLoading: false });
            return
        } else if (!Add_productData.How_to_clean) {
            alert('Please select How_to_clean');
            this.setState({ isLoading: false });
            return
        } else if (!Add_productData.IsActive) {
            alert('Please select IsActive');
            this.setState({ isLoading: false });
            return
        } else if (!Add_productData.Image_Name1) {
            alert('Please select Image_Name 1');
            this.setState({ isLoading: false });
            return
        } else if (!Add_productData.Image_Name2) {
            alert('Please select Image_Name 2');
            this.setState({ isLoading: false });
            return
        } else if (!Add_productData.Image_Name3) {
            alert('Please select Image_Name 3');
            this.setState({ isLoading: false });
            return
        } else if (!Add_productData.Image_Name4) {
            alert('Please select Image_Name 4');
            this.setState({ isLoading: false });
            return
        }

        firebase.firestore().collection('Products').add({

            Sr_No: this.state.Add_productData.Sr_No,
            Category_Name: this.state.Add_productData.Category_Name,
            subCategory_Name:this.state.Add_productData.subCategory_Name,
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
        Add_productData.Sr_No = ''
        Add_productData.Category_Name = ''
        Add_productData.subCategory_Name = ''
        Add_productData.Product_Name = ''
        Add_productData.Product_ID = ''
        Add_productData.Cost_Price = ''
        Add_productData.Selling_Price = ''
        Add_productData.MRP = ''
        Add_productData.Weight = ''
        Add_productData.Usage = ''
        Add_productData.How_to_clean = ''
        Add_productData.Image_Name1 = ''
        Add_productData.Image_Name2 = ''
        Add_productData.Image_Name3 = ''
        Add_productData.Image_Name4 = ''
        Add_productData.IsActive = ''
        this.setState({
            isLoading: false,
            addModal: !this.state.addModal,
            Add_productData
        })

    }

    Excel_Modal() {
        this.setState({ Excel_Modal: !this.state.Excel_Modal });
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
        this.setState({ isLoading: true });
        console.log("UploadExcel");
        var f = this.state.file;
        console.log(f);
        if (f === undefined) {
            alert("Please select Excel file first");
            return
        }
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
            this.upload_data(result).then(d => {
                console.log("testing", d)
            })
        };
    }
    async upload_data(Array_of_Object) {
        var unAvailableImages = [];
        var i = 1;
        console.log("this is row object", Array_of_Object[0].length);
        var wait = new Promise((resolve, reject) => {
            Array_of_Object[0].forEach(async (rowObject, index) => {
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
                    "\n IsActive ", rowObject.IsActive,
                    "\n subcategories", rowObject.subcategories
                );
                if (rowObject.Image_Name1 !== undefined) {
                    await storageRef.child(`Images/${rowObject.Image_Name1}`).getDownloadURL().then(onfulfilled => {
                        Array_of_Object[0][index].Image_Name1 = onfulfilled
                    }, onrejected => {
                        console.log("onrejected", onrejected);
                        unAvailableImages.push(Array_of_Object[0][index].Image_Name1);
                    });
                }
                if (rowObject.Image_Name2 !== undefined) {
                    await storageRef.child(`Images/${rowObject.Image_Name2}`).getDownloadURL().then(onfulfilled => {
                        Array_of_Object[0][index].Image_Name2 = onfulfilled
                    }, onrejected => {
                        console.log("onrejected", onrejected);
                        unAvailableImages.push(Array_of_Object[0][index].Image_Name2);
                    });
                }
                if (rowObject.Image_Name3 !== undefined) {
                    await storageRef.child(`Images/${rowObject.Image_Name3}`).getDownloadURL().then(onfulfilled => {
                        Array_of_Object[0][index].Image_Name3 = onfulfilled
                    }, onrejected => {
                        console.log("onrejected", onrejected);
                        unAvailableImages.push(Array_of_Object[0][index].Image_Name3);
                    });
                }
                if (rowObject.Image_Name4 !== undefined) {
                    await storageRef.child(`Images/${rowObject.Image_Name4}`).getDownloadURL().then(onfulfilled => {
                        Array_of_Object[0][index].Image_Name4 = onfulfilled
                    }, onrejected => {
                        console.log("onrejected", onrejected);
                        unAvailableImages.push(Array_of_Object[0][index].Image_Name4);
                    });
                }
                if (index === Array_of_Object[0].length - 1) resolve();
            })
        })
        wait.then(() => {
            console.log("Done");
            console.log("New Array", Array_of_Object, "Undefined Image Array", unAvailableImages);
            setTimeout(() => {
                Array_of_Object[0].forEach(async (rowObject, index) => {
                    if (rowObject.Image_Name1 !== undefined && rowObject.Image_Name1.startsWith("https:", 0)) {
                        firebase.firestore().collection('Products').doc(rowObject.Product_ID).set({
                            Sr_No: rowObject.Sr_No === undefined ? "" : rowObject.Sr_No,
                            Product_ID: rowObject.Product_ID === undefined ? "" : rowObject.Product_ID,
                            Category_Name: rowObject.Category_Name === undefined ? "" : rowObject.Category_Name,
                            Product_Name: rowObject.Product_Name === undefined ? "" : rowObject.Product_Name,
                            Cost_Price: rowObject.Cost_Price === undefined ? "" : rowObject.Cost_Price,
                            Selling_Price: rowObject.Selling_Price === undefined ? "" : rowObject.Selling_Price,
                            MRP: rowObject.MRP === undefined ? "" : rowObject.MRP,
                            ML: rowObject.ML === undefined ? "" : rowObject.ML,
                            Weight: rowObject.Weight === undefined ? "" : rowObject.Weight,
                            Usage: rowObject.Usage === undefined ? "" : rowObject.Usage,
                            How_to_clean: rowObject.How_to_clean === undefined ? "" : rowObject.How_to_clean,
                            Image_Name1: rowObject.Image_Name1 === undefined ? "" : rowObject.Image_Name1,
                            Image_Name2: rowObject.Image_Name2 === undefined ? "" : rowObject.Image_Name2,
                            Image_Name3: rowObject.Image_Name3 === undefined ? "" : rowObject.Image_Name3,
                            Image_Name4: rowObject.Image_Name4 === undefined ? "" : rowObject.Image_Name4,
                            IsActive: rowObject.IsActive === undefined ? "" : rowObject.IsActive,
                            subcategories: rowObject.subcategories === undefined ? "" : rowObject.subcategories,
                        }).then(() => {
                            i++;
                            console.log("Data Uploaded Succefully");
                            if (Array_of_Object[0].length === i) {
                                this.setState({ isLoading: !this.state.isLoading });
                            }
                        })
                    } else {
                        unAvailableImages.push(rowObject);
                        if (Array_of_Object[0].length === i) {
                            this.setState({ isLoading: false });
                        }
                    }
                });
            },);
            this.setState({ Excel_Modal: false, file: '' })
               })
        // return true
    }
    // Image upload for add form
    async Upload_Image(Img) {
        console.log("image for firebaseImg", Img);
        this.setState({ ProgressBar: !this.state.ProgressBar })
        // const uploadTask = await firebase.storage().ref(`/Images/${Img.name}`).put(Img);
        this.setState({
            uploadTask: this.state.storageRef.child(`Images/${Img.name}`).put(Img)
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
    async Upload_Image2(Img) {
        console.log("image for firebaseImg", Img);
        this.setState({ ProgressBar2: !this.state.ProgressBar2 })
        // const uploadTask = await firebase.storage().ref(`/Images/${Img.name}`).put(Img);
        this.setState({
            uploadTask2: this.state.storageRef2.child(`Images/${Img.name}`).put(Img)
        },
            () => {
                this.state.uploadTask2.on(
                    'state_changed',
                    snap => {
                        const percentUploaded2 = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                        this.setState({ percentUploaded2 });
                    },
                    err => {
                        console.error(err);
                    },
                    () => {
                        this.state.uploadTask2.snapshot.ref.getDownloadURL().then(downloadUrl => {
                            console.log('this is the image url', downloadUrl);
                            let { Add_productData } = this.state;
                            Add_productData.Image_Name2 = downloadUrl;
                            this.setState({ Add_productData, ProgressBar2: !this.state.ProgressBar2 }, () => console.log("1", this.state.Add_productData.Image_Name2))


                        })
                            .catch(err => {
                                console.error(err);
                            })
                    }
                )
            }
        )
    }
    async Upload_Image3(Img) {
        console.log("image for firebaseImg", Img);
        this.setState({ ProgressBar3: !this.state.ProgressBar3 })
        // const uploadTask = await firebase.storage().ref(`/Images/${Img.name}`).put(Img);
        this.setState({
            uploadTask3: this.state.storageRef3.child(`Images/${Img.name}`).put(Img)
        },
            () => {
                this.state.uploadTask3.on(
                    'state_changed',
                    snap => {
                        const percentUploaded3 = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                        this.setState({ percentUploaded3 });
                    },
                    err => {
                        console.error(err);
                    },
                    () => {
                        this.state.uploadTask3.snapshot.ref.getDownloadURL().then(downloadUrl => {
                            console.log('this is the image url', downloadUrl);
                            let { Add_productData } = this.state;
                            Add_productData.Image_Name3 = downloadUrl;
                            this.setState({ Add_productData, ProgressBar3: !this.state.ProgressBar3 }, () => console.log("1", this.state.Add_productData.Image_Name3))


                        })
                            .catch(err => {
                                console.error(err);
                            })
                    }
                )
            }
        )
    }
    async Upload_Image4(Img) {
        console.log("image for firebaseImg", Img);
        this.setState({ ProgressBar4: !this.state.ProgressBar4 })
        // const uploadTask = await firebase.storage().ref(`/Images/${Img.name}`).put(Img);
        this.setState({
            uploadTask4: this.state.storageRef4.child(`Images/${Img.name}`).put(Img)
        },
            () => {
                this.state.uploadTask4.on(
                    'state_changed',
                    snap => {
                        const percentUploaded4 = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                        this.setState({ percentUploaded4 });
                    },
                    err => {
                        console.error(err);
                    },
                    () => {
                        this.state.uploadTask4.snapshot.ref.getDownloadURL().then(downloadUrl => {
                            console.log('this is the image url', downloadUrl);
                            let { Add_productData } = this.state;
                            Add_productData.Image_Name4 = downloadUrl;
                            this.setState({ Add_productData, ProgressBar4: !this.state.ProgressBar4 }, () => console.log("1", this.state.Add_productData.Image_Name4))

                        })
                            .catch(err => {
                                console.error(err);
                            })
                    }
                )
            }
        )
    }

    // Image upload for Edit form
    async E_Upload_Image(Img) {
        console.log("image for firebaseImg", Img);
        this.setState({ EProgressBar: !this.state.EProgressBar })
        // const uploadTask = await firebase.storage().ref(`/Images/${Img.name}`).put(Img);
        this.setState({
            EuploadTask: this.state.EstorageRef.child(`Images/${Img.name}`).put(Img)
        },
            () => {
                this.state.EuploadTask.on(
                    'state_changed',
                    snap => {
                        const EpercentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                        this.setState({ EpercentUploaded });
                    },
                    err => {
                        console.error(err);
                    },
                    () => {
                        this.state.EuploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                            console.log('this is the image url', downloadUrl);
                            let { Edit_ProductData } = this.state;
                            Edit_ProductData.Image_Name1 = downloadUrl;
                            this.setState({ Edit_ProductData, EProgressBar: !this.state.EProgressBar }, () => console.log("1", this.state.Edit_ProductData.Image_Name1))

                        })
                            .catch(err => {
                                console.error(err);
                            })
                    }
                )
            }
        )
    }
    async E_Upload_Image2(Img) {
        console.log("image for firebaseImg", Img);
        this.setState({ EProgressBar2: !this.state.EProgressBar2 })
        // const uploadTask = await firebase.storage().ref(`/Images/${Img.name}`).put(Img);
        this.setState({
            EuploadTask2: this.state.EstorageRef2.child(`Images/${Img.name}`).put(Img)
        },
            () => {
                this.state.EuploadTask2.on(
                    'state_changed',
                    snap => {
                        const EpercentUploaded2 = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                        this.setState({ EpercentUploaded2 });
                    },
                    err => {
                        console.error(err);
                    },
                    () => {
                        this.state.EuploadTask2.snapshot.ref.getDownloadURL().then(downloadUrl => {
                            console.log('this is the image url', downloadUrl);
                            let { Edit_ProductData } = this.state;
                            Edit_ProductData.Image_Name2 = downloadUrl;
                            this.setState({ Edit_ProductData, EProgressBar2: !this.state.EProgressBar2 }, () => console.log("1", this.state.Edit_ProductData.Image_Name2))

                        })
                            .catch(err => {
                                console.error(err);
                            })
                    }
                )
            }
        )
    }
    async E_Upload_Image3(Img) {
        console.log("image for firebaseImg", Img);
        this.setState({ EProgressBar3: !this.state.EProgressBar3 })
        // const uploadTask = await firebase.storage().ref(`/Images/${Img.name}`).put(Img);
        this.setState({
            EuploadTask3: this.state.EstorageRef3.child(`Images/${Img.name}`).put(Img)
        },
            () => {
                this.state.EuploadTask3.on(
                    'state_changed',
                    snap => {
                        const EpercentUploaded3 = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                        this.setState({ EpercentUploaded3 });
                    },
                    err => {
                        console.error(err);
                    },
                    () => {
                        this.state.EuploadTask3.snapshot.ref.getDownloadURL().then(downloadUrl => {
                            console.log('this is the image url', downloadUrl);
                            let { Edit_ProductData } = this.state;
                            Edit_ProductData.Image_Name3 = downloadUrl;
                            this.setState({ Edit_ProductData, EProgressBar3: !this.state.EProgressBar3 }, () => console.log("1", this.state.Edit_ProductData.Image_Name3))

                        })
                            .catch(err => {
                                console.error(err);
                            })
                    }
                )
            }
        )
    }
    async E_Upload_Image4(Img) {
        console.log("image for firebaseImg", Img);
        this.setState({ EProgressBar4: !this.state.EProgressBar4 })
        // const uploadTask = await firebase.storage().ref(`/Images/${Img.name}`).put(Img);
        this.setState({
            EuploadTask4: this.state.EstorageRef4.child(`Images/${Img.name}`).put(Img)
        },
            () => {
                this.state.EuploadTask4.on(
                    'state_changed',
                    snap => {
                        const EpercentUploaded4 = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                        this.setState({ EpercentUploaded4 });
                    },
                    err => {
                        console.error(err);
                    },
                    () => {
                        this.state.EuploadTask4.snapshot.ref.getDownloadURL().then(downloadUrl => {
                            console.log('this is the image url', downloadUrl);
                            let { Edit_ProductData } = this.state;
                            Edit_ProductData.Image_Name4 = downloadUrl;
                            this.setState({ Edit_ProductData, EProgressBar4: !this.state.EProgressBar4 }, () => console.log("1", this.state.Edit_ProductData.Image_Name4))

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
        const { ProgressBar, ProgressBar2, ProgressBar3, ProgressBar4 } = this.state;
        const { EProgressBar, EProgressBar2, EProgressBar3, EProgressBar4 } = this.state;
        const pageButtonRenderer = ({ page, active, disable, title, onPageChange }) => {
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

                <h1>Products List</h1>
                <div style={{ marginTop: '5%' }}>
                    <div style={{ marginRight: 10, marginBottom: 10, marginTop: 10 }}>
                        <Button color="primary" size="md" className="mr-2" onClick={() => { this.AddModal(); }}>
                            Add New Product
                        </Button>
                        <Button color="primary" size="md" className="mr-2" onClick={() => { this.Excel_Modal(); }}>
                            Upload Excel
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
                        hover
                        condensed
                        // bordered={false}
                        loading={true}
                        pagination={paginationFactory(options)}
                    />
                </div>

                {/* Excel Modal */}
                <Modal isOpen={this.state.Excel_Modal} toggle={() => this.Excel_Modal()}
                    style={{ padding: '15px' }} centered>
                    <ModalHeader toggle={() => this.Excel_Modal()}
                        style={{ border: 'none' }}
                        cssModule={{
                            'modal-title': 'w-100 text-center', 'border-bottom': '0px',
                            'padding': '2rem 1rem 0rem 1rem'
                        }}>
                        <h2>Upload Excel</h2>
                    </ModalHeader>
                    <ModalBody >
                        <FormGroup>
                            <Label for="Product_ID">Choose Excel File to Upload </Label>
                            <input
                                type="file"
                                accept=".xls,.xlsx"
                                onChange={(e) => this.filePathset(e)}
                                name="Excel_File" />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => { this.UploadExcel() }}>Confirm</Button>
                        <Button color="secondary" onClick={() => this.Excel_Modal()}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                {/* Edit modal */}
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
                    <ModalBody>
                        <FormGroup>
                            <Label for="Category_Name">Category Name</Label>
                            <select type="select" value={this.state.Edit_ProductData.Category_Name}
                                onChange={(e) => {
                                    const { Edit_ProductData } = this.state;
                                    Edit_ProductData.Category_Name = e.target.value;
                                    console.log("e.target.value :", e.target.value)
                                    this.setState({ Edit_ProductData });
                                }}>
                                <option value="">Selected Option: {this.state.Edit_ProductData.Category_Name}</option>
                                <option value="Wellness"></option>
                                <option value="Decore">Decore</option>
                                <option value="Spiritual">Spiritual</option>
                                <option value="Traditional">Traditional</option>
                            </select>
                        </FormGroup>
                        {
                            (this.state.Edit_ProductData.Category_Name=='Wellness')?
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
                            }
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
                            <Label for="Cost_Price">Cost Price</Label>
                            <Input type="number" min="1" step="1" name="Cost_Price" id="Cost_Price" placeholder="Enter Cost Price"
                                value={this.state.Edit_ProductData.Cost_Price}
                                onChange={(e) => {
                                    const { Edit_ProductData } = this.state;
                                    Edit_ProductData.Cost_Price = parseInt(e.target.value);
                                    this.setState({ Edit_ProductData });
                                }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="Selling_Price">Selling Price</Label>
                            <Input type="number" min="1" step="1" name="Selling_Price" id="Selling_Price" placeholder="Enter Selling Price"
                                value={this.state.Edit_ProductData.Selling_Price}
                                onChange={(e) => {
                                    const { Edit_ProductData } = this.state;
                                    Edit_ProductData.Selling_Price = parseInt(e.target.value);
                                    this.setState({ Edit_ProductData });
                                }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="MRP">MRP</Label>
                            <Input type="number" min="1" step="1" name="MRP" id="MRP" placeholder="Enter MRP"
                                value={this.state.Edit_ProductData.MRP}
                                onChange={(e) => {
                                    const { Edit_ProductData } = this.state;
                                    Edit_ProductData.MRP = parseInt(e.target.value);
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
                            <input type="file" name="Image_Name1" id="Image_Name1" placeholder="Enter Image Name 1" ref="upload" accept="image/*"
                                // value={this.state.Edit_ProductData.Image_Name1}
                                onChange={(e) => {
                                    console.log("File selected", e.target.files[0]);
                                    this.E_Upload_Image(e.target.files[0])
                                }} />
                        </FormGroup>
                        {this.state.EProgressBar ? <Progress value={this.state.EpercentUploaded} /> : <img src={this.state.Edit_ProductData.Image_Name1} alt="Image 1" style={{ width: 150, height: 100 }} />}
                        <FormGroup>
                            <Label for="Image_Name 2">Image Name 2</Label>
                            <input type="file" name="Image_Name2" id="Image_Name2" placeholder="Enter Image Name 2" ref="upload" accept="image/*"
                                // value={this.state.Edit_ProductData.Image_Name2}
                                onChange={(e) => {
                                    console.log("File selected", e.target.files[0]);
                                    this.E_Upload_Image2(e.target.files[0])
                                }} />
                        </FormGroup>
                        {this.state.EProgressBar2 ? <Progress value={this.state.EpercentUploaded2} /> : <img src={this.state.Edit_ProductData.Image_Name2} alt="Image 2" style={{ width: 150, height: 100 }} />}
                        <FormGroup>
                            <Label for="Image_Name3">Image Name 3</Label>
                            <input type="file" name="Image_Name3" id="Image_Name3" placeholder="Enter Image Name 3" ref="upload" accept="image/*"
                                // value={this.state.Edit_ProductData.Image_Name3}
                                onChange={(e) => {
                                    console.log("File selected", e.target.files[0]);
                                    this.E_Upload_Image3(e.target.files[0])
                                }} />
                        </FormGroup>
                        {this.state.EProgressBar3 ? <Progress value={this.state.EpercentUploaded3} /> : <img src={this.state.Edit_ProductData.Image_Name3} alt="Image 3" style={{ width: 150, height: 100 }} />}
                        <FormGroup>
                            <Label for="Image_Name4">Image Name 4</Label>
                            <input type="file" name="Image_Name4" id="Image_Name4" placeholder="Enter Image Name 4" ref="upload" accept="image/*"
                                // value={this.state.Edit_ProductData.Image_Name4}
                                onChange={(e) => {
                                    console.log("File selected", e.target.files[0]);
                                    this.E_Upload_Image4(e.target.files[0])
                                }}
                            />
                        </FormGroup>
                        {this.state.EProgressBar4 ? <Progress value={this.state.EpercentUploaded4} /> : <img src={this.state.Edit_ProductData.Image_Name4} alt="Image 4" style={{ width: 150, height: 100 }} />}
                        <FormGroup>
                            <Label for="IsActive">IsActive</Label>
                            <select type="select" value={this.state.Edit_ProductData.IsActive}
                                onChange={(e) => {
                                    const { Edit_ProductData } = this.state;
                                    Edit_ProductData.IsActive = e.target.value;
                                    console.log("selected value", e.target.value)
                                    this.setState({ Edit_ProductData });
                                }}
                            >
                                <option value="">Selected Option: {this.state.Edit_ProductData.IsActive}</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </FormGroup>

                    </ModalBody>
                    <ModalFooter>
                        {EProgressBar === false && EProgressBar2 === false && EProgressBar3 === false && EProgressBar4 === false ?
                            <Button color="primary" onClick={() => { this.setState({ isLoading: true }); this.EditProductDetails() }}>Edit</Button>
                            : <Button color="primary" onClick={() => { console.log("Let images upload first"); alert("Let the Images upload first") }} >Confirm</Button>}
                        <Button color="secondary" onClick={this.toggleeditProductModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>

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
                        <Label style={{ fontSize: 30, color: '#B87333' }} >Add new Product</Label>
                    </ModalHeader>
                    <ModalBody >
                        <Form>
                            <FormGroup>
                                <Label for="exampleSelect">Category Name</Label>
                                <select type="select" name="select" id="exampleSelect"
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        Add_productData.Category_Name = e.target.value;
                                        console.log("e.target.value :", e.target.value)
                                        this.setState({ Add_productData });
                                    }}>
                                    <option value="">Select Option</option>
                                    <option value="Wellness">Wellness</option>
                                    <option value="Decore">Decore</option>
                                    <option value="Spiritual">Spiritual</option>
                                    <option value="Traditional">Traditional</option>
                                </select>
                            </FormGroup>
                            {
                            (this.state.Add_productData.Category_Name=='Wellness')?
                            (
                                <FormGroup>
                                <Label for="exampleSelect">Sub-Category Name</Label>
                                <select type="select" name="select" id="exampleSelect"
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        Add_productData.subCategory_Name = e.target.value;
                                        console.log("e.target.value :", e.target.value)
                                        this.setState({ Add_productData });
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
                            }

                            {/* <FormGroup>
                                <Label for="Product_ID">Product ID</Label>
                                <Input type="text" name="Product_ID" id="Product_ID" placeholder="Enter Product ID" readonly
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        Add_productData.Product_ID = e.target.value;
                                        this.setState({ Add_productData });
                                    }} />
                            </FormGroup> */}
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
                                <Label for="Cost_Price">Cost Price</Label>
                                <Input type="number" min="1" step="1" name="Cost_Price" id="Cost_Price" placeholder="Enter Cost Price"
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        // Add_productData.Cost_Price = parseInt(e.target.value);
                                        Add_productData.Cost_Price = e.target.value;
                                        this.setState({ Add_productData });
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="Selling_Price">Selling Price</Label>
                                <Input type="number" min="1" step="1" name="Selling_Price" id="Selling_Price" placeholder="Enter Selling Price"
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        Add_productData.Selling_Price = parseInt(e.target.value);
                                        this.setState({ Add_productData });
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="MRP">MRP</Label>
                                <Input type="number" min="1" step="1" name="MRP" id="MRP" placeholder="Enter MRP"
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        Add_productData.MRP = parseInt(e.target.value);
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
                                <Label for="Image_Name1">Image Name 1</Label>
                                <input type="file" name="Image_Name1" id="Image_Name1" placeholder="Enter Image Name 1" ref="upload" accept="image/*"
                                    onChange={(e) => {
                                        console.log("File selected", e.target.files[0]);
                                        this.Upload_Image(e.target.files[0])
                                    }} />
                            </FormGroup>
                            {this.state.ProgressBar ? <Progress value={this.state.percentUploaded} /> : null}
                            <FormGroup>
                                <Label for="Image_Name 2">Image Name 2</Label>
                                <input type="file" name="Image_Name2" id="Image_Name2" placeholder="Enter Image Name 2" ref="upload" accept="image/*"
                                    onChange={(e) => {
                                        console.log("File selected", e.target.files[0]);
                                        this.Upload_Image2(e.target.files[0])
                                    }} />
                            </FormGroup>
                            {this.state.ProgressBar2 ? <Progress value={this.state.percentUploaded2} /> : null}
                            <FormGroup>
                                <Label for="Image_Name3">Image Name 3</Label>
                                <input type="file" name="Image_Name3" id="Image_Name3" placeholder="Enter Image Name 3" ref="upload" accept="image/*"
                                    onChange={(e) => {
                                        console.log("File selected", e.target.files[0]);
                                        this.Upload_Image3(e.target.files[0])
                                    }} />
                            </FormGroup>
                            {this.state.ProgressBar3 ? <Progress value={this.state.percentUploaded3} /> : null}
                            <FormGroup>
                                <Label for="Image_Name4">Image Name 4</Label>
                                <input type="file" name="Image_Name4" id="Image_Name4" placeholder="Enter Image Name 4" ref="upload" accept="image/*"
                                    onChange={(e) => {
                                        console.log("File selected", e.target.files[0]);
                                        this.Upload_Image4(e.target.files[0])
                                    }} />
                            </FormGroup>
                            {this.state.ProgressBar4 ? <Progress value={this.state.percentUploaded4} /> : null}
                            <FormGroup>
                                <Label for="IsActive">IsActive</Label>
                                <select type="select" name="select" id="IsActive"
                                    onChange={(e) => {
                                        const { Add_productData } = this.state;
                                        Add_productData.IsActive = e.target.value;
                                        console.log("selected value", e.target.value)
                                        this.setState({ Add_productData });
                                    }}
                                >
                                    <option value="">Select Option</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        {ProgressBar === false && ProgressBar2 === false && ProgressBar3 === false && ProgressBar4 === false ?
                            <Button color="primary" onClick={() => { this.setState({ isLoading: true }); this.Add_productData() }}>Confirm</Button>
                            : <Button color="primary" onClick={() => { console.log("Let images upload first"); alert("Let the Images upload first") }} >Confirm</Button>}
                        <Button color="secondary" onClick={() => this.AddModal()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}