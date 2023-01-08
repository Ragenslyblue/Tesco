import axios from "axios";
import { Snackbar } from "@mui/material";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

const createTeacher = async (data) => {
  return await axios.post("http://localhost:5000/api/create-teacher", data);
};
const getTeacher = async () => {
  return await axios.get("http://localhost:5000/api/teacher");
};
const deleteTeacher = async (data) => {
  return await axios.delete(`http://localhost:5000/api/teacher/${data}`);
};
export const editTeacher = async (_ids, data) => {
  const response = await axios.put(
    `http://localhost:5000/api/teacher/${_ids}`,
    data
  );
  return await response.data;
};
const getSingleTeacher = async (data) => {
  return await axios.get(`http://localhost:5000/api/teacher/${data}`);
};

export const UseCreateTeacherHooks = () => {
  const queryClient = useQueryClient();
  return useMutation(createTeacher, {
    onSuccess: () => {
      queryClient.invalidateQueries("teacher-data");
    },
  });
};
export const GetTeacherHook = (onSuccess, onError) => {
  return useQuery("teacher-data", getTeacher, {
    onSuccess,
    onError,
  });
};

export const DeleteTeacherHook = (setDeletionError) => {
  const queryClient = useQueryClient();
  return useMutation(deleteTeacher, {
    onSuccess: () => {
      queryClient.invalidateQueries("teacher-data");
    },
    onError: ({ message }) => {
      setDeletionError(message);
    },
  });
};
export const UpdateTeacherHook = () => {
  const queryClient = useQueryClient();
  return useMutation(editTeacher, {
    onSuccess: () => {
      queryClient.invalidateQueries("teacher-data");
    },
    onError: ({ message }) => {},
  });
};
export const GetSingleTeacherHook = (onSuccess, onError) => {
  return useQuery("teacher-single-data", getSingleTeacher, {
    onSuccess,
    onError,
  });
};
