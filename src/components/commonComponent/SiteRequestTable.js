import React, { useState, useEffect, useContext } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import { DataGrid } from '@mui/x-data-grid'

// ** GraphQL Imports
import { useQuery, useMutation } from '@apollo/client'
import { GET_SITE_REQUESTS, GET_MY_SITE_REQUESTS } from 'src/graphql/query/siteRequest'
import { REVIEW_SITE_REQUEST } from 'src/graphql/mutation/siteRequest'
// ** Context Imports
import { AuthContext } from 'src/context/AuthContext'

// ** Component Imports
import TableHeader from 'src/views/site/list/TableHeader'
import AddSite from 'src/views/site/list/AddSite'
import Loader from 'src/components/loader/loader'

// ** Utils
import Moment from 'react-moment'
import toast from 'react-hot-toast'

// ** Status Chip Colors
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'warning'
    case 'approved':
      return 'success'
    case 'rejected':
      return 'error'
    default:
      return 'default'
  }
}

// ** Site Request Table Component
const SiteRequestTable = () => {
  // ** Context
  const { user: authUser } = useContext(AuthContext)
  const isAdmin = authUser?.role === 'admin'
  const isClient = authUser?.role === 'client'

  // ** State
  const [data, setData] = useState([])
  const [totalRow, setTotalRow] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [searchText, setSearchText] = useState('')
  const [addSiteOpen, setAddSiteOpen] = useState(false)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // ** Modal States for Review Actions
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [reviewAction, setReviewAction] = useState(null) // 'approve' or 'reject'
  const [reviewMessage, setReviewMessage] = useState('')

  const queryToUse = isClient ? GET_MY_SITE_REQUESTS : GET_SITE_REQUESTS
  
  const { loading, error, data: siteRequestsData, refetch } = useQuery(queryToUse, {
    variables: { 
      page: pageNumber, 
      limit: pageSize, 
      search: searchText,
      filter: ''
    },
    fetchPolicy: 'cache-and-network',
  })


  const [reviewSiteRequest] = useMutation(REVIEW_SITE_REQUEST)

  useEffect(() => {
    
    if (siteRequestsData?.getSiteRequests) {
      setData(siteRequestsData.getSiteRequests.data || [])
      setTotalRow(siteRequestsData.getSiteRequests.count || 0)
    }
    else if (siteRequestsData?.getMySiteRequests) {
      setData(siteRequestsData.getMySiteRequests.data || [])
      setTotalRow(siteRequestsData.getMySiteRequests.count || 0)
    }
  }, [siteRequestsData])



  useEffect(() => {
    if (error) {
      console.error('GraphQL Error:', error)
    }
  }, [error])

  const handleSearchChange = (searchValue) => {
    setSearchText(searchValue)
    setPageNumber(1)
  }

  // ** Modal Handlers
  const handleOpenReviewModal = (request, action) => {
    setSelectedRequest(request)
    setReviewAction(action)
    setReviewMessage('')
    setReviewModalOpen(true)
  }

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false)
    setSelectedRequest(null)
    setReviewAction(null)
    setReviewMessage('')
  }

  const toggleAddSiteDrawer = () => setAddSiteOpen(!addSiteOpen)

  const handleReviewRequest = async (request, status) => {
    if (!reviewMessage.trim()) {
      return
    }

    setIsLoading(true)
    try {
      await reviewSiteRequest({
        variables: {
          input: {
            id: request.id,
            status: status,
            adminResponse: reviewMessage
          }
        }
      })
      
      // Close modal and refresh data
      handleCloseReviewModal()
      refetch()
      
      // Show success message
      toast.success(`Site request ${status} successfully!`)
    } catch (error) {
      console.error('Error reviewing site request:', error)
      toast.error('Failed to review site request')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveRequest = async () => {
    if (!selectedRequest) return

    setIsLoading(true)
    try {
      await reviewSiteRequest({
        variables: {
          input: {
            id: selectedRequest.id,
            status: 'approved',
            adminResponse: reviewMessage || 'Request approved'
          }
        }
      })
      
      toast.success('Site request approved successfully!')
      setReviewDialogOpen(false)
      refetch()
    } catch (error) {
      toast.error(error.message || 'Failed to approve request')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectRequest = async () => {
    if (!selectedRequest) return

    setIsLoading(true)
    try {
      await reviewSiteRequest({
        variables: {
          input: {
            id: selectedRequest.id,
            status: 'rejected',
            adminResponse: reviewMessage || 'Request rejected'
          }
        }
      })
      
      toast.success('Site request rejected successfully!')
      setReviewDialogOpen(false)
      refetch()
    } catch (error) {
      toast.error(error.message || 'Failed to reject request')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false)
    setSelectedRequest(null)
    setReviewMessage('')
  }

  const getColumns = () => {
    const baseColumns = [
    {
      minWidth: 200,
      field: 'requestedSite',
      headerName: 'Requested Site',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row.requestedSite}
          </Typography>
        </Box>
      )
    },
    {
      minWidth: 300,
      field: 'requestedDescription',
      headerName: 'Description',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row.requestedDescription}
          </Typography>
        </Box>
      )
    },
    {
      minWidth: 200,
      field: 'requestMessage',
      headerName: 'Request Message',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row.requestMessage}
          </Typography>
        </Box>
      )
    },
    {
      minWidth: 150,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }) => (
        <Chip
          label={row.status}
          color={getStatusColor(row.status)}
          size='small'
          sx={{ textTransform: 'capitalize' }}
        />
      )
    },
    {
      minWidth: 150,
      field: 'createdAt',
      headerName: 'Requested Date',
      renderCell: ({ row }) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          <Moment format='MMM DD, YYYY'>{row.createdAt}</Moment>
        </Typography>
      )
    }
  ]

    // ** Add admin-specific columns
    if (isAdmin) {
      baseColumns.push(
      {
        minWidth: 200,
        field: 'userId',
        headerName: 'Requested By',
        renderCell: ({ row }) => (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {row.userId?.userName || row.userId?.email || 'N/A'}
                  </Typography>
                  {row.userId?.userName && (
                    <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                      {row.userId?.email || 'N/A'}
                    </Typography>
                  )}
                </Box>
              </Box>
        )
      },
          {
            minWidth: 150,
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            renderCell: ({ row }) => (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {row.status === 'pending' && (
                  <Button
                    size='small'
                    variant='contained'
                    color='primary'
                    onClick={() => handleOpenReviewModal(row, 'review')}
                    sx={{ minWidth: 'auto', px: 2 }}
                  >
                    Review
                  </Button>
                )}
                {row.status !== 'pending' && row.adminResponse && (
                  <Button
                    size='small'
                    variant='outlined'
                    onClick={() => {
                      setSelectedRequest(row)
                      setReviewDialogOpen(true)
                    }}
                    sx={{ minWidth: 'auto', px: 2 }}
                  >
                    View Review
                  </Button>
                )}
              </Box>
            )
          }
    )
  }

    // ** Add client-specific columns
    if (isClient) {
      baseColumns.push({
        minWidth: 200,
        field: 'adminResponse',
        headerName: 'Admin Response',
        renderCell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' }}>
              {row.adminResponse || 'No response yet'}
            </Typography>
          </Box>
        )
      })
    }

    return baseColumns
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <TableHeader 
              toggle={toggleAddSiteDrawer} 
              handleChange={handleSearchChange}
              For={isAdmin ? "Site Requests" : "My Site Requests"}
            />
            
            <Box sx={{ height: 400, width: '100%' }}>
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography>
                    {isAdmin ? 'Loading all site requests...' : 'Loading your site requests...'}
                  </Typography>
                </Box>
              )}
              <DataGrid
                autoHeight
                paginationMode='server'
                loading={loading}
                rows={data}
                columns={getColumns()}
                pageSize={pageSize}
                rowCount={totalRow}
                page={pageNumber - 1}
                onPageChange={(newPage) => setPageNumber(newPage + 1)}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                disableSelectionOnClick
                rowsPerPageOptions={[10, 25, 50, 100]}
                sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Add Site Drawer */}
      <AddSite 
        open={addSiteOpen} 
        toggle={toggleAddSiteDrawer} 
        siteRefetch={refetch}
      />

      {/* Review Dialog */}
      <Dialog 
        open={reviewDialogOpen} 
        onClose={handleCloseReviewDialog}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>
          {selectedRequest?.status === 'pending' 
            ? (isAdmin ? 'Review Site Request' : 'Site Request Details') 
            : 'Review Details'
          }
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ pt: 2 }}>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <strong>Requested Site:</strong> {selectedRequest.requestedSite}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <strong>Description:</strong> {selectedRequest.requestedDescription}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <strong>Request Message:</strong> {selectedRequest.requestMessage}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <strong>Requested By:</strong> {selectedRequest.userId?.userName || selectedRequest.userId?.email} ({selectedRequest.userId?.email})
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <strong>Status:</strong> 
                <Chip 
                  label={selectedRequest.status} 
                  color={getStatusColor(selectedRequest.status)} 
                  size='small' 
                  sx={{ ml: 1, textTransform: 'capitalize' }}
                />
              </Typography>
              
              {selectedRequest.status === 'pending' && isAdmin && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label='Review Message'
                  value={reviewMessage}
                  onChange={(e) => setReviewMessage(e.target.value)}
                  placeholder='Enter your review message...'
                  sx={{ mt: 2 }}
                />
              )}
              
              {selectedRequest.status !== 'pending' && selectedRequest.adminResponse && (
                <Typography variant='body2' sx={{ mt: 2 }}>
                  <strong>Admin Response:</strong> {selectedRequest.adminResponse}
                </Typography>
              )}
              
              {selectedRequest.status === 'approved' && selectedRequest.createdSiteId && (
                <Typography variant='body2' sx={{ mt: 2 }}>
                  <strong>Created Site:</strong> {selectedRequest.createdSiteId.site}
                  {selectedRequest.createdSiteId.description && (
                    <span> - {selectedRequest.createdSiteId.description}</span>
                  )}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Close</Button>
          {selectedRequest?.status === 'pending' && isAdmin && (
            <>
              <Button 
                onClick={handleRejectRequest} 
                color='error'
                disabled={isLoading}
              >
                Reject
              </Button>
              <Button 
                onClick={handleApproveRequest} 
                color='success'
                variant='contained'
                disabled={isLoading}
              >
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Review Modal */}
      <Dialog
        open={reviewModalOpen}
        onClose={handleCloseReviewModal}
        maxWidth="sm"
        fullWidth
        aria-labelledby="review-modal-title"
      >
        <DialogTitle id="review-modal-title" sx={{ pb: 2 }}>
          <Typography variant="h5" component="div">
            Review Site Request
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedRequest?.requestedSite}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Site Request Details
            </Typography>
            <Box sx={{ pl: 2, borderLeft: '3px solid', borderColor: 'primary.main' }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Site URL:</strong> {selectedRequest?.requestedSite}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Description:</strong> {selectedRequest?.requestedDescription}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Request Message:</strong> {selectedRequest?.requestMessage}
              </Typography>
              <Typography variant="body1">
                <strong>Requested By:</strong> {selectedRequest?.userId?.userName || selectedRequest?.userId?.email}
              </Typography>
            </Box>
          </Box>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Review Question
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            Do you want to approve or reject this site request? Please provide your response below.
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Admin Response"
            placeholder="Enter your review message here..."
            value={reviewMessage}
            onChange={(e) => setReviewMessage(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseReviewModal}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleReviewRequest(selectedRequest, 'approved')}
            variant="contained"
            color="success"
            disabled={!reviewMessage.trim() || isLoading}
            sx={{ mr: 1 }}
          >
            {isLoading ? 'Processing...' : 'Approve'}
          </Button>
          <Button
            onClick={() => handleReviewRequest(selectedRequest, 'rejected')}
            variant="contained"
            color="error"
            disabled={!reviewMessage.trim() || isLoading}
          >
            {isLoading ? 'Processing...' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Overlay */}
      <Loader disable={isLoading} />
    </>
  )
}

export default SiteRequestTable
