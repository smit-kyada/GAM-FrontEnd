import { useQuery } from '@apollo/client';
import { Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { GET_LAST_REPORT_LOGS } from 'src/graphql/query/reportlog';

const LastReport = () => {

  const router = useRouter()

  const [data, setData] = useState()

  // Graphql query
  const { loading: siteLoading, error: siteError, data: reportlog, refetch: siteRefetch } = useQuery(GET_LAST_REPORT_LOGS, {
    variables: {},
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    reportlog?.getLastApplog && setData(reportlog?.getLastApplog)
  }, [reportlog])

  return (
    <div>
      {
        (router?.pathname == "/livereport" || router?.pathname == "/sitereport")
          ?
          <Typography variant='subtitle2' >Today</Typography>
          :
          <Typography variant='subtitle2' >{`Last updated at`} <Moment format='MMMM Do YYYY On h:mm:ss a'>{data?.createdAt}</Moment></Typography>

      }
    </div>
  )
}

export default LastReport

