import React, { Component } from 'react'
import { Alert, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Form, Progress } from 'reactstrap';
import firebase from 'firebase';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

export default function PdfDocument(props) {
    console.log("prop data", props.data1);
    return (
        <Document>
            <Page style={styles.page}>
                {props.data
                    ? props.data.map((a, index) => {
                        return (
                            <View>
                                {a.Product_Name}
                            </View>
                        )
                    })
                    : " "
                }
            </Page>
        </Document>
    )
}