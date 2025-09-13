import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import { EMAIL_VERIFIED } from 'src/graphql/mutation/user'

const EmailVerification = () => {

  const router = useRouter();

  // ** Graphql
  const [emailVerify] = useMutation(EMAIL_VERIFIED);
  const { verificationCode } = router?.query;

  const string = verificationCode?.split("_")
  const id = string?.[0]
  const code = string?.[1]

  useEffect(() => {

    id && code && emailVerify({
      variables: { code: code, verifyEmailId: id }
    }).then((result) => {
      if (result?.data?.verifyEmail) {
        toast.success("Email Verify Successfully !")
        router.push('/login')
      }
    })
      .catch((error) => {
        toast.error(error?.message)
      })

  }, [router, emailVerify, code, id])

  return (
    <></>
  )
}

EmailVerification.getLayout = page => <BlankLayout>{page}</BlankLayout>

EmailVerification.guestGuard = true

export default EmailVerification
