import { CircularProgress, Dialog, DialogContent, DialogContentText } from "@mui/material";


const Loader = ({ disable }) => {
  return (
    <>
      <Dialog
        open={disable}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent sx={{ textAlign: 'center' }}>
          <CircularProgress />
          <DialogContentText id='alert-dialog-description'>Loading...</DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Loader;
