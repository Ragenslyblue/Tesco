import axios from "axios";
import { Snackbar } from "@mui/material";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
const baseUrl = "http://localhost:5000/api";
const createTeacher = async (data) => {
  return await axios.post(baseUrl + "/create-teacher", data);
};
const getTeacher = async () => {
  return await axios.get(baseUrl + "/teacher");
};
const deleteTeacher = async (data) => {
  return await axios.delete(`${baseUrl}/teacher/${data}`);
};
const editTeacher = async (body) => {
  const response = await axios.put(`${baseUrl}/teacher`, body);
  return response.data;
};
const getSingleTeacher = async (data) => {
  return await axios.get(`${baseUrl}/teacher/${data}`);
};

export const createTopic = async (data) => {
  return await axios.post(baseUrl + "/topic", data);
};
const getTopic = async () => {
  return await axios.get(baseUrl + "/topic");
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
export const UseUpdate = () => {
  return useMutation((variables) => {
    return axios.put("http://localhost:5000/api/teacher", variables);
  });
};
export const GetSingleTeacherHook = (onSuccess, onError) => {
  return useQuery("teacher-single-data", getSingleTeacher, {
    onSuccess,
    onError,
  });
};

export const GetTopicHook = (onSuccess, onError) => {
  return useQuery("topic-data", getTopic, {
    onSuccess,
    onError,
  });
};
