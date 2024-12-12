const AppData = {
  fullName: null,
  className: null,
  role: null,
  password: null,
  email: null,
  resetEmail: null,

  setFullName(name) {
    if (name) {
      this.fullName = name;
    } else {
      console.warn('Attempted to set undefined or null for fullName');
    }
  },

  getFullName() {
    return this.fullName || '';
  },

  setClassName(className) {
    if (className) {
      this.className = className;
    } else {
      console.warn('Attempted to set undefined or null for className');
    }
  },

  getClassName() {
    return this.className || '';
  },

  setEmail(email) {
    if (email) {
      this.email = email;
    } else {
      console.warn('Attempted to set undefined or null for email');
    }
  },

  getEmail() {
    return this.email || '';
  },

  setRole(role) {
    if (role) {
      this.role = role;
    } else {
      console.warn('Attempted to set undefined or null for role');
    }
  },

  getRole() {
    return this.role || '';
  },

  clearData() {
    this.fullName = null;
    this.className = null;
    this.role = null;
    this.password = null;
    this.email = null;
    this.resetEmail = null;
  },
};

export default AppData;