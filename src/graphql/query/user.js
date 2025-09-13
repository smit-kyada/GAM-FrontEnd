import gql from "graphql-tag";

export const GET_ME = gql`
query Get_me {
  get_me {
    id
    isAdmin
    userName
    companyName
    fName
    lName
    email
    contact
    isEmailVerified
    role
    profileImg
    showTotalGameUser
    isPolicyAccept
    block
    isActive
    isOnlyReport
    showReport
    showAllData
    companyAddress
    Designation
    pincode
  }
}

`;



export const GET_USER = gql`
query Query($getUserId: ID) {
  getUser(id: $getUserId) {
    id
    userName
    email
    showTotalGameUser
    role
    block
    isAdmin
    companyAddress
    Designation
    pincode
  }
}
`;

export const GET_USER_LIST = gql`
query GetUserList($page: Number, $limit: Number, $filter: String, $isSearch: Boolean, $search: String) {
  getUserList(page: $page, limit: $limit, filter: $filter, isSearch: $isSearch, search: $search) {
    count
    data {
      id
      userName
      companyName
      fName
      lName
      email
      contact
      isEmailVerified
      role
      profileImg
      showTotalGameUser
      isPolicyAccept
      block
      users{
        id
      userName
      email
      contact
      role
      profileImg
      showTotalGameUser
      block
      }
      isActive
      isOnlyReport
      showAllData
      showReport
      companyAddress
    Designation
    pincode
    }
  }
}
`;


export const GET_USER_ACCOUNTS = gql`
query GetAllAccounts($page: Number, $limit: Number, $isSearch: Boolean, $filter: String, $search: String) {
  getAllAccounts(page: $page, limit: $limit, isSearch: $isSearch, filter: $filter, search: $search) {
    count
    data {
      id
      userId {
        id
        email
      }
      bankName
      IFSC
      accountHolderName
      accountNumber
      accountType
      GstNumber
      GstCertificate
      active
    }
  }
}
`;

export const GET_ADMIN_TOKEN = gql`
query Query($getAdminTokenId: ID) {
  getAdminToken(id: $getAdminTokenId)
}
`;


export const GET_USERDASHBOARD = gql`
query Query($page: Number, $limit: Number, $isSearch: Boolean, $filter: String, $search: String, $startDate: Date, $endDate: Date) {
  getDashBoardData(page: $page, limit: $limit, isSearch: $isSearch, filter: $filter, search: $search, startDate: $startDate, endDate: $endDate)
}
`;






export const GET_REGISTER_OTP = gql`
query GetJWTUserId($token: String) {
  getJWTUserId(token: $token) {
    id
    registerOtp
    registerOtpExpiry
    registerVerified
    phoneOTP
    phoneOtpExpiry
    contact
    email
  }
}
`;




export const GET_BLOCKUSER_QUERY = gql`
query GetQueriesByUserId($getQueriesByUserIdId: ID) {
  getQueriesByUserId(id: $getQueriesByUserIdId) {
    id
    userId {
      id
      email
      companyName
      contact
      userName
    }
    isRaised
    message
  }
}
`;





export const GET_ALL_BLOCK_USER_QUERY = gql`
query GetAllQueries($page: Number, $limit: Number, $isSearch: Boolean, $filter: String, $search: String) {
  getAllQueries(page: $page, limit: $limit, isSearch: $isSearch, filter: $filter, search: $search) {
    count
    data {
      id
      userId {
        id
        userName
        companyName
        fName
        lName
        email
        contact
        isEmailVerified
        role
        profileImg
        showTotalGameUser
        isPolicyAccept
        block
        isActive
        companyAddress
        Designation
        pincode
      }
      isRaised
      message
    }
  }
}
`;



