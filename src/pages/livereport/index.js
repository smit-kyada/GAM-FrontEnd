// import { useQuery } from '@apollo/client'
// import { Button, Dialog, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material'
// import { useEffect, useState } from 'react'
// import { GET_ALL_SITES } from 'src/graphql/query/site'
// import { useAuth } from 'src/hooks/useAuth'
// import Livereport from 'src/views/livereport/Livereport'

// const SiteTable = () => {

//   // ** State
//   const [pageNumber, setPageNumber] = useState(1)
//   const [userSite, SetUserSite] = useState([])
//   const [liveReportPassword, setLiveReportPassword] = useState("admin@livereport")
//   const [isAuthenticate, setisAuthenticate] = useState(false)

//   const auth = useAuth()

//   // Graphql query
//   const { loading: siteLoading, error: siteError, data: siteData, refetch: siteRefetch } = useQuery(GET_ALL_SITES, {
//     variables: { page: pageNumber, limit: 100, },
//     fetchPolicy: "cache-and-network",
//     skip: auth?.user?.role === "admin"
//   });

//   useEffect(() => {
//     siteData?.getAllSites?.data && SetUserSite(siteData?.getAllSites?.data?.map((site, index) => site?.site))
//   }, [siteData])

//   useEffect(() => {
//     localStorage.setItem("livereport", liveReportPassword)
//     localStorage.getItem("isAuthenticate")

//   }, [typeof window !== "undefined" && localStorage.getItem("isAuthenticate")])

//   return (
//     <>
//       <Livereport userSite={userSite} />

//       <Dialog
//         open={true}
//         ria-labelledby='customized-dialog-title'
//         sx={{
//           backdropFilter: "blur(12px)",
//           '& .MuiDialog-paper': { overflow: 'visible' }
//         }}
//         fullWidth
//         maxWidth="xs"
//       >
//         <DialogTitle id='customized-dialog-title' sx={{ p: 4, textAlign: "center" }}>
//           <Typography variant='h5' component='span' align="center">
//             Report Date Select
//           </Typography>
//         </DialogTitle>
//         <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important` }}>
//           <Grid container sm={12} sx={{ justifyContent: "end" }}>

//             <Grid item sm={12}>
//               <TextField fullWidth label="password" />
//             </Grid>
//             <Button variant='outlined' sx={{ mr: 4, mt: 2 }} >login</Button>
//           </Grid>
//         </DialogContent>
//       </Dialog>

//     </>
//   )
// }



// SiteTable.acl = {
//   action: 'read',
//   subject: 'livereport-p'
// }

// export default SiteTable
import { useQuery } from '@apollo/client';
import { Button, Dialog, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { GET_ALL_SITES } from 'src/graphql/query/site';
import { useAuth } from 'src/hooks/useAuth';
import Livereport from 'src/views/livereport/Livereport';

const SiteTable = () => {
  // ** State
  const [pageNumber, setPageNumber] = useState(1);
  const [userSite, setUserSite] = useState([]);
  const [inputPassword, setInputPassword] = useState('');
  const [liveReportPassword, setLiveReportPassword] = useState('');
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const auth = useAuth();

  // GraphQL query
  const { loading: siteLoading, error: siteError, data: siteData, refetch: siteRefetch } = useQuery(GET_ALL_SITES, {
    variables: { page: pageNumber, limit: 100 },
    fetchPolicy: 'cache-and-network',
    skip: auth?.user?.role === 'admin',
  });

  useEffect(() => {
    if (siteData?.getAllSites?.data) {
      setUserSite(siteData?.getAllSites?.data?.map((site) => site?.site));
    }
  }, [siteData]);

  useEffect(() => {
    const storedPassword = localStorage.getItem('liveReportPassword');
    const storedUserPassword = localStorage.getItem('userPassword');
    const storedAuth = localStorage.getItem('isAuthenticate');

    if (storedPassword) {
      setLiveReportPassword(storedPassword);
    } else {
      const defaultPassword = 'admin@livereport';
      localStorage.setItem('liveReportPassword', defaultPassword);
      setLiveReportPassword(defaultPassword);
    }

    if (storedUserPassword && storedUserPassword === storedPassword) {
      setIsAuthenticate(true);
    } else {
      setIsAuthenticate(false);
    }

  }, []);

  const handleLogin = () => {
    if (inputPassword === liveReportPassword) {
      setIsAuthenticate(true);
      localStorage.setItem('isAuthenticate', true);
      localStorage.setItem('userPassword', inputPassword);
      setErrorMessage('');
    } else {
      setErrorMessage('Wrong password. Please try again.');
    }
  };

  return (
    <>
      {isAuthenticate ? (
        <Livereport userSite={userSite} />
      ) : (
        <Dialog
          open={true}
          aria-labelledby="customized-dialog-title"
          sx={{
            backdropFilter: 'blur(12px)',
            '& .MuiDialog-paper': { overflow: 'visible' },
          }}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle id="customized-dialog-title" sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" component="span" align="center">
              Live Report
            </Typography>
          </DialogTitle>
          <DialogContent dividers sx={{ p: (theme) => `${theme.spacing(4)} !important` }}>
            <Grid container sm={12} sx={{ justifyContent: 'end' }}>
              <Grid item sm={12}>
                <TextField
                  fullWidth
                  label="Password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  type="password"
                />
              </Grid>
              {errorMessage && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {errorMessage}
                </Typography>
              )}
              <Button variant="outlined" sx={{ mr: 4, mt: 2 }} onClick={handleLogin}>
                Login
              </Button>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

SiteTable.acl = {
  action: 'read',
  subject: 'livereport-p',
};

export default SiteTable;
