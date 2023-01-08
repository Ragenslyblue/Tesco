import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Modal,
  Button,
  Typography,
} from "@mui/material";
import { Form, Field, Formik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import ModalComponent from "../../shared/Modal/Modal";
import {
  DeleteTeacherHook,
  editTeacher,
  GetSingleTeacherHook,
  UpdateTeacherHook,
} from "../../utils/CustomQuerHook/CustomQueryHook";
import PaginationAdd from "../pagination/Pagination";

import "./table.css";
import Swal from "sweetalert2";

const TabelComponent = ({
  cellData,
  pagination,
  tableHead = [],
  tableType,
}) => {
  const [data, setData] = useState([]);
  const [ids, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [errors, setError] = useState("");
  const [indexs, setIndex] = useState("");

  const { mutate, isError } = DeleteTeacherHook();

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = (_id) => {
    setOpen(true);
    setId(_id);
  };
  const handleOpenEdit = (_id, index) => {
    setOpenEdit(true);
    setId(_id);
    setIndex(index);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  const handleSubmit = () => {
    mutate(ids);
    if (isError) {
      return setError(isError);
    }
    setOpen(false);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Teacher deleted successfully",
      showConfirmButton: false,
      timer: 1500,
    });
  };
  const handleSubmitEdit = async (values) => {
    const data = {
      username: values.userName,
      lastname: values.lastName,
      middlename: values.middleName,
      firstname: values.firstName,
    };
    const response = await editTeacher(ids, data);
    if (response && response?.success) {
      setOpenEdit(false);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Teacher updated successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const initialValues = {
    firstName: "",
    lastName: "",
    middleName: "",
    userName: "",
  };

  // console.log(initialValues,'vaue')
  useEffect(() => {
    // console.log(indexs,'indexs')
    cellData?.data?.data?.map((each, index) => {
      if (index === indexs) {
        initialValues.firstName = each?.firstname;
        initialValues.lastName = each?.lastname;
        initialValues.middleName = each?.middlename;

        initialValues.userName = each?.username;
      }
    });
  }, [indexs, initialValues, cellData]);

  const teacherSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "minimum 2 character")
      .max(50, "maximum 50 character")
      .required("Required"),
    lastName: Yup.string()
      .min(2, "minimum 2 character")
      .max(50, "maximum 50 character")
      .required("Required"),
    // middleName: Yup.string()
    //   .min(2, "Too Short!")
    //   .max(50, "Too Long!")
    //   .required("Required"),
    userName: Yup.string()
      .min(2, "minimum 2 character")
      .max(50, "maximum 50 character")
      .required("Required"),
  });
  return (
    <>
      {tableType === "topic" && (
        <TableContainer component={Paper}>
          <Table aria-label="table-container">
            <TableHead>
              <TableRow>
                {tableHead.map((each) => (
                  <TableCell>{each.title}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.topics}</TableCell>
                    <TableCell>{row.instructor}</TableCell>
                    <TableCell>{row.datecreated}</TableCell>
                    <TableCell
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.2em",
                      }}
                    >
                      <button
                        style={{
                          color: "white",
                          backgroundColor: "blue",
                          minWidth: "5em",
                          borderRadius: "0.5em",
                          border: "none",
                        }}
                      >
                        edit
                      </button>
                      <button
                        style={{
                          color: "white",
                          backgroundColor: "red",
                          minWidth: "5em",
                          borderRadius: "0.5em",
                          border: "none",
                        }}
                      >
                        delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {tableType === "teacher" && (
        <TableContainer component={Paper}>
          <Table aria-label="table-container">
            <TableHead>
              <TableRow>
                {tableHead.map((each) => (
                  <TableCell>{each.title}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {cellData &&
                cellData?.data?.data?.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{row._id}</TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{row.firstname}</TableCell>
                    <TableCell>{row.registerDate}</TableCell>
                    <TableCell
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.2em",
                      }}
                    >
                      <button
                        onClick={() => handleOpenEdit(row._id, index)}
                        style={{
                          color: "white",
                          backgroundColor: "blue",
                          minWidth: "5em",
                          borderRadius: "0.5em",
                          border: "none",
                        }}
                      >
                        edit
                      </button>
                      <button
                        onClick={() => handleOpen(row._id)}
                        style={{
                          color: "white",
                          backgroundColor: "red",
                          minWidth: "5em",
                          borderRadius: "0.5em",
                          border: "none",
                        }}
                      >
                        delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* **modal for delete component** */}
      {
        <ModalComponent open={open}>
          <Typography>Are you sure want to delete?</Typography>
          <Box sx={{ padding: "1em" }}>
            <Button color="warning" onClick={handleSubmit}>
              Yes
            </Button>
            <Button onClick={handleClose}>No</Button>
          </Box>
        </ModalComponent>
      }
      {
        <ModalComponent open={openEdit} handleClose={handleClose}>
          <Formik
            initialValues={initialValues}
            validationSchema={teacherSchema}
            onSubmit={(values) => {
              handleSubmitEdit(values);
            }}
          >
            {({ errors, touched }) => (
              <Form
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <Typography variant="h6">Update Teacher</Typography>
                <Field name="firstName" placeholder="firstname" />
                {errors.firstName && touched.firstName ? (
                  <p style={{ fontSize: "1em", color: "red" }}>
                    {errors.firstName}
                  </p>
                ) : null}
                <Field name="middleName" placeholder="middlename" />
                {errors.middleName && touched.middleName ? (
                  <p style={{ fontSize: "1em", color: "red" }}>
                    {errors.middleName}
                  </p>
                ) : null}
                <Field name="lastName" placeholder="lastname" />
                {errors.lastName && touched.lastName ? (
                  <p style={{ fontSize: "1em", color: "red" }}>
                    {errors.lastName}
                  </p>
                ) : null}

                <Field name="userName" placeholder="username" type="text" />
                {errors.userName && touched.userName ? (
                  <p style={{ fontSize: "1em", color: "red" }}>
                    {errors.userName}
                  </p>
                ) : null}

                <Button type="submit">Update</Button>
                <Button onClick={handleCloseEdit}>Close</Button>
              </Form>
            )}
          </Formik>
        </ModalComponent>
      }

      {tableType === "result" && (
        <TableContainer component={Paper}>
          <Table aria-label="table-container">
            <TableHead>
              <TableRow>
                {tableHead.map((each) => (
                  <TableCell>{each.title}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.topic}</TableCell>
                    <TableCell>{row.instructor}</TableCell>
                    <TableCell>{row.score}</TableCell>
                    <TableCell>{row.date}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {tableType === "passer" && (
        <TableContainer component={Paper}>
          <Table aria-label="table-container">
            <TableHead>
              <TableRow>
                {tableHead.map((each) => (
                  <TableCell>{each.title}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.topic}</TableCell>
                    <TableCell style={{ color: "green" }}>
                      {row.correct}
                    </TableCell>
                    <TableCell style={{ color: "red" }}>{row.wrong}</TableCell>
                    <TableCell
                      style={{ color: "blue" }}
                    >{`${row.result}%`}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {pagination && (
        <Box
          justifyContent={"center"}
          alignItems="center"
          display={"flex"}
          margin="2em 0em"
        >
          <PaginationAdd
            setProducts={(e) => setData(e)}
            rawData={cellData?.data?.data}
          />
        </Box>
      )}
    </>
  );
};

export default TabelComponent;
