'use server'

import {auth} from '@/auth'

const getSession = async () => {
    return await auth()
}
