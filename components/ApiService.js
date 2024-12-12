import apiClient from './ApiClient';

// API Services
const ApiService = {
  loginUser: (loginRequest) => {
    return apiClient.post('api/users/login', loginRequest);
  },

  postAttendance: (attendance) => {
    return apiClient.post('api/attendance/post', attendance);
  },

  getAttendance: (fullname) => {
    return apiClient.get(`api/attendance/${fullname}`);
  },

  getUser: (identifier) => {
    return apiClient.get(`api/users/user/${identifier}`);
  },

  getStudents: () => {
    return apiClient.get('api/students');
  },

  getStudent: (email) => {
    return apiClient.get(`api/students/${email}`);
  },

  postChildObservation: (childObservationRequest) => {
    return apiClient.post('api/child-observations/child_observations', childObservationRequest);
  },

  getStudentObservations: (fullName) => {
    return apiClient.get(`api/child-observations/child_observations/${fullName}`);
  },

  postUploadAudio: (audioFile) => {
    return apiClient.post('api/upload-audio/upload_audio', audioFile, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getLatestAudio: () => {
    return apiClient.get('api/upload-audio/audio/latest');
  },
  
  postVideoUrl: (videoUrlRequest) => {
    return apiClient.post('api/video/_video', videoUrlRequest);
  },

  getVideoUrl: () => {
    return apiClient.get('api/video/_video');
  },

  uploadPhoto: (photo, category) => {
    const formData = new FormData();
    formData.append('images', photo);
    formData.append('category', category);

    return apiClient.post('api/upload/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getPhotos: (category) => {
    return apiClient.get('api/upload/images', { params: { category } });
  },

  getProfile: (email) => {
    return apiClient.get(`api/profile/${email}`);
  },

  updateProfile: (email, profileRequest) => {
    return apiClient.post(`api/profile/create?email=${email}`, profileRequest);
  },

  submitWorkUpdates: (workUpdatesRequest) => {
    return apiClient.post('api/work-updates/work-updates/submit', workUpdatesRequest);
  },

  getWorkUpdates: () => {
    return apiClient.get('api/work-updates/work-updates');
  },

  sendNotification: (notification) => {
    return apiClient.post('api/notification/sendNotification', notification);
  },

  getNotifications: () => {
    return apiClient.get('api/notification/notifications');
  },

  storeCrewMembers: (crewMembers) => {
    return apiClient.post('api/crewMembers/crew-members', crewMembers);
  },

  getCrewMembersByFullName: (fullName) => {
    return apiClient.get('api/crewMembers/crew-members', { params: { fullName } });
  },

  submitFeedback: (feedback) => {
    return apiClient.post('api/feedback/feedback', feedback);
  },

  getSiblingByFullName: (fullName) => {
    return apiClient.get('api/crewMembers/crew-members/additional', { params: { fullName } });
  },

  changePassword: (changePasswordRequest) => {
    return apiClient.post('api/users/change-password', changePasswordRequest);
  },

  sendOtp: (otpData) => {
    return apiClient.post('api/otp/store-otp', otpData);
  },

  verifyOtp: (otpVerificationRequest) => {
    return apiClient.post('api/otp/verify-otp', otpVerificationRequest);
  },

  resetPassword: (resetPasswordRequest) => {
    return apiClient.post('api/users/reset-password', resetPasswordRequest);
  },

  sendDailyReports: (reports) => {
    return apiClient.post('api/dailyReports/submit', reports);
  },

  getReportByStudentName: (studentName) => {
    return apiClient.get(`/api/dailyReports/reports/by-student/${studentName}`);
  }
};

export default ApiService;
