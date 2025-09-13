import gql from "graphql-tag";

export const USER_LOGIN = gql`
mutation Login($email: String, $password: String, $isSideLogin: Boolean) {
  login(email: $email, password: $password, isSideLogin: $isSideLogin) {
    token
    user {
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
    isOnlyReport
    showReport
    showAllData
    isAdmin
    }
  }
}
`

export const GET_ME1 = gql`
mutation GetMe($user: String) {
  getMe(user: $user) {
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
    isOnlyReport
    showReport
    showAllData
    isAdmin
  }
}
`;

export const ADD_USER = gql`
mutation Mutation($input: InUser) {
  addUser(input: $input) {
    userName
    role
    profileImg
    id
    email
    contact
  }
}
`;

export const CREATE_SITE_PASSWORD = gql`
mutation Mutation($createSitePasswordId: ID, $password: String) {
  createSitePassword(id: $createSitePasswordId, password: $password)
}
`;

export const UPDATE_PASSWORD = gql`
mutation Mutation($password: String, $updatePasswordId: ID) {
  updatePassword(password: $password, id: $updatePasswordId)
}
`;

export const UPDATE_USER = gql`
mutation Mutation($input: InUpUser) {
  updateUser(input: $input) {
    userName
    role
  }
}
`;

export const BLOCK_USER = gql`
mutation BlockUser($input: InBlockUser) {
  blockUser(input: $input) {
    block
  }
}
`;

export const IN_ACTIVE_USER = gql`
mutation InActiveUser($input: InActiveUser) {
  inActiveUser(input: $input) {
    isActive
  }
}
`;

export const DELETE_USER = gql`
mutation Mutation($deleteUserId: ID) {
  deleteUser(id: $deleteUserId)
}
`;

export const IMPORT_USER = gql`
mutation ImportUser($input: JSON!) {
  importUser(input: $input)
}
`;

export const FORGOT_PASSWORD = gql`
mutation Mutation($email: String) {
  forgotPassword(email: $email)
}
`;

export const RESET_PASSWORD = gql`
mutation Mutation($resetPasswordId: ID, $code: String, $password: String) {
  resetPassword(id: $resetPasswordId, code: $code, password: $password)
}
`;

export const USER_REGISTER = gql`
mutation Register($input: InUser) {
  register(input: $input)
}
`;

export const EMAIL_VERIFIED = gql`
mutation VerifyEmail($code: String, $verifyEmailId: ID) {
  verifyEmail(code: $code, id: $verifyEmailId)
}
`;




export const ADD_SUBADMIN = gql`
mutation Mutation($input: InUser) {
  register(input: $input) {
    message
    status
    user {
      id
      userName
      email
      contact
      role
      profileImg
      showTotalGameUser
    }
  }
}
`;


export const ADD_USER_BANK_ACCOUNT = gql`
mutation CreateAccount($input: InAccount) {
  createAccount(input: $input) {
    GstCertificate
    GstNumber
    IFSC
    accountHolderName
    accountNumber
    accountType
    active
    bankName
    id
  }
}
`;


export const UPDATE_USER_ACCOUNT = gql`
mutation UpdateAccount($input: InUpAccount) {
  updateAccount(input: $input) {
    IFSC
    GstNumber
    accountHolderName
    bankName
  }
}
`;


export const DELETE_USER_ACCOUNT = gql`
mutation DeleteAccount($deleteAccountId: ID) {
  deleteAccount(id: $deleteAccountId)
}
`;


export const GENERATE_ADMIN_TOKEN = gql`
mutation GenerateAdminToken($generateAdminTokenId: ID) {
  generateAdminToken(id: $generateAdminTokenId)
}
`;



export const VARIFY_REGISTER_OTP = gql`
mutation VerifyRegisterOtp($input: InRegisterOtp) {
  verifyRegisterOtp(input: $input)
}
`;



export const VARIFY_LOGIN_OTP = gql`
mutation VerifyLoginOtp($input: InLoginOtp) {
  verifyLoginOtp(input: $input) {
    token
    user {
      id
      userName
      email
      contact
      role
      block
      isActive
      isOnlyReport
      showReport
      showAllData
      isAdmin
    }
  }
}

`;



export const LOGIN_WITH_MOBILE = gql`
  mutation LoginWithMobile($email: String) {
  loginWithMobile(email: $email)
}
`;



export const DOWNLOAD_AGREEMENT = gql`
mutation DownloadAgreement($input: String) {
  DownloadAgreement(input: $input)
}
`;


export const RAISE_UNBLOCK_QUERY = gql`
mutation CreateQueries($input: InQueries) {
  createQueries(input: $input) {
    id
    message
    isRaised
  }
}

`;

export const RESEND_OTP = gql`
mutation ReSendOTP($reSendOtpId: ID, $otpType: String) {
  reSendOTP(id: $reSendOtpId, otpType: $otpType) {
    link
    message
  }
}
`;


export const RESEND_VERIFICATION_EMAIL = gql`
mutation ReSendVerificationEmail($email: String) {
  reSendVerificationEmail(email: $email)
}
`;

