import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout';
import { EMAIL_VERIFIED } from 'src/graphql/mutation/user'

const Privacypolicy = () => {

    return (
        <div>privacy-policy</div>
    )
}

Privacypolicy.getLayout = page => <BlankLayout>{page}</BlankLayout>

Privacypolicy.guestGuard = true

export default Privacypolicy